#!/usr/bin/env node
/**
 * Cleanup script: Remove duplicate device documents, keeping only the newest per deviceId (case-insensitive)
 * Usage: node scripts/cleanupDuplicates.js
 */

import path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

// Manually load .env.local BEFORE importing db module
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../.env.local");

try {
  const envContent = readFileSync(envPath, "utf-8");
  const lines = envContent.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...valueParts] = trimmed.split("=");
      process.env[key.trim()] = valueParts.join("=").trim();
    }
  }
} catch (err) {
  console.error("❌ Failed to load .env.local:", err.message);
  process.exit(1);
}

// Now dynamically import modules that depend on env vars
const mongoose = await import("mongoose");
const { connectDB } = await import("../src/lib/db.js");
const Device = (await import("../src/models/Device.js")).default;

async function cleanup() {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await connectDB();

    console.log("📊 Finding duplicate deviceIds (case-insensitive)...");

    // Aggregate using lowercase deviceId to find case-insensitive duplicates
    const duplicates = await Device.aggregate([
      {
        $addFields: {
          lowerDeviceId: { $toLower: "$deviceId" },
        },
      },
      {
        $group: {
          _id: "$lowerDeviceId",
          count: { $sum: 1 },
          docs: { $push: { _id: "$_id", lastSeen: "$lastSeen" } },
          newest: { $max: "$lastSeen" },
        },
      },
      { $match: { count: { $gt: 1 } } },
      { $sort: { count: -1 } },
    ]);

    if (duplicates.length === 0) {
      console.log("✅ No duplicates found. Database is clean!");
      process.exit(0);
    }

    console.log(`\n⚠️  Found ${duplicates.length} deviceId(s) with duplicates:\n`);

    let totalDeleted = 0;

    for (const dup of duplicates) {
      const normalizedDeviceId = dup._id; // lowercase version
      const count = dup.count;
      const allDocs = dup.docs; // all docs for this normalized ID

      console.log(`  📦 ${normalizedDeviceId}: ${count} records`);

      // Sort by lastSeen descending to find the newest
      allDocs.sort((a, b) => new Date(b.lastSeen) - new Date(a.lastSeen));
      const newestId = allDocs[0]._id;
      const toDeleteIds = allDocs.slice(1).map((d) => d._id);

      // Delete all EXCEPT the newest
      if (toDeleteIds.length > 0) {
        const result = await Device.deleteMany({ _id: { $in: toDeleteIds } });
        console.log(`     ✓ Deleted ${result.deletedCount} old records, kept newest\n`);
        totalDeleted += result.deletedCount;
      }

      // Also update the newest record to have normalized (lowercase) deviceId
      await Device.findByIdAndUpdate(newestId, {
        deviceId: normalizedDeviceId,
      });
    }

    console.log(`\n✨ Cleanup complete! Deleted ${totalDeleted} duplicate records.\n`);

    // Show stats after cleanup
    const totalDevices = await Device.countDocuments();
    const uniqueDeviceIds = await Device.distinct("deviceId");

    console.log(`📈 Database Stats:`);
    console.log(`   Total documents: ${totalDevices}`);
    console.log(`   Unique deviceIds: ${uniqueDeviceIds.length}`);
    console.log(`\n✅ All remaining deviceIds are now normalized (lowercase)!\n`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Cleanup failed:", err.message);
    process.exit(1);
  }
}

cleanup();
