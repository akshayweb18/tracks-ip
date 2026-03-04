#!/usr/bin/env node
/**
 * Delete the extra 'akshaychaudhari' device record
 */
import dotenv from "dotenv";
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
  console.error("Failed to load .env.local");
  process.exit(1);
}

const { connectDB } = await import("../src/lib/db.js");
const Device = (await import("../src/models/Device.js")).default;

(async () => {
  try {
    await connectDB();
    console.log("🗑️  Deleting extra 'akshaychaudhari' device...");
    
    const result = await Device.deleteMany({ deviceId: "akshaychaudhari" });
    console.log(`✅ Deleted ${result.deletedCount} record(s)`);
    
    const remaining = await Device.countDocuments();
    console.log(`📊 Remaining devices: ${remaining}`);
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
})();
