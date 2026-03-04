#!/usr/bin/env node
/**
 * Cleanup script: Remove devices with "Unknown-" assignedEmployee
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

(async () => {
  try {
    await connectDB();
    console.log("🗑️  Removing devices with 'Unknown-' employee names...");
    
    const result = await Device.deleteMany({ 
      assignedEmployee: { $regex: "^Unknown-" } 
    });
    
    console.log(`✅ Deleted ${result.deletedCount} device(s) with 'Unknown-' names`);
    
    const remaining = await Device.countDocuments();
    console.log(`📊 Remaining clean devices: ${remaining}\n`);
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
})();
