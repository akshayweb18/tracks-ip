#!/usr/bin/env node
/**
 * Cleanup script: Remove duplicate device records by IP, keeping only the newest per IP
 * Usage: node scripts/cleanupByIP.js
 */

import path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

// Manual env loading
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

const { connectDB } = await import("../src/lib/db.js");
const Device = (await import("../src/models/Device.js")).default;

async function cleanup() {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await connectDB();

    console.log("📊 Finding duplicate IPs...");

    // Find duplicates by publicIP
    const duplicates = await Device.aggregate([
      {
        $match: {
          publicIP: { $exists: true, $ne: null, $ne: "" },
        },
      },
      {
        $group: {
          _id: "$publicIP",
          count: { $sum: 1 },
          docs: { $push: { _id: "$_id", lastSeen: "$lastSeen", deviceId: "$deviceId" } },
        },
      },
      { $match: { count: { $gt: 1 } } },
      { $sort: { count: -1 } },
    ]);

    if (duplicates.length === 0) {
      console.log("✅ No duplicate IPs found. Database is clean!");
      process.exit(0);
    }

    console.log(`\n⚠️  Found ${duplicates.length} IP(s) with multiple devices:\n`);

    let totalDeleted = 0;

    for (const dup of duplicates) {
      const ip = dup._id;
      const count = dup.count;
      const allDocs = dup.docs;

      console.log(`  🌐 ${ip}: ${count} devices`);

      // Sort by lastSeen descending to find the newest
      allDocs.sort((a, b) => new Date(b.lastSeen) - new Date(a.lastSeen));
      const newestId = allDocs[0]._id;
      const newestDevice = allDocs[0].deviceId;
      const toDeleteIds = allDocs.slice(1).map((d) => d._id);

      // Show which device is being kept
      console.log(`     ✓ Keeping newest: ${newestDevice} (${new Date(allDocs[0].lastSeen).toLocaleString()})`);

      // Delete all EXCEPT the newest
      if (toDeleteIds.length > 0) {
        const result = await Device.deleteMany({ _id: { $in: toDeleteIds } });
        console.log(`     ✓ Deleted ${result.deletedCount} old records\n`);
        totalDeleted += result.deletedCount;
      }
    }

    console.log(`\n✨ Cleanup complete! Deleted ${totalDeleted} duplicate records.\n`);

    // Show stats after cleanup
    const totalDevices = await Device.countDocuments();
    const uniqueIPs = await Device.distinct("publicIP");

    console.log(`📈 Database Stats:`);
    console.log(`   Total devices: ${totalDevices}`);
    console.log(`   Unique IPs: ${uniqueIPs.length}`);
    console.log(`\n✅ Only the latest device per IP remains!\n`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Cleanup failed:", err.message);
    process.exit(1);
  }
}

cleanup();
