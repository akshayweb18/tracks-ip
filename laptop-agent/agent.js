// laptop-agent/agent.js
const axios = require("axios");
const os = require("os");
const publicIp = require("public-ip");
const fs = require("fs");
const path = require("path");

// Load .env.local FIRST so EMPLOYEE_NAME is available
const envPath = path.resolve(__dirname, "../.env.local");
try {
  const envContent = fs.readFileSync(envPath, "utf-8");
  const lines = envContent.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...valueParts] = trimmed.split("=");
      process.env[key.trim()] = valueParts.join("=").trim();
    }
  }
} catch (err) {
  // .env.local may not exist, continue without it
}

// Get actual system data
const deviceId = os.hostname(); // Actual laptop/computer name

function getAssignedEmployee() {
  // Priority 1: EMPLOYEE_NAME from .env.local (preferred)
  const envName = (process.env.EMPLOYEE_NAME || "").trim();
  if (envName && envName.toLowerCase() !== "user") return envName;

  // Priority 2: OS username
  const osUser = (os.userInfo && os.userInfo().username) ? String(os.userInfo().username).trim() : "";
  if (osUser && osUser.toLowerCase() !== "user") return osUser;

  // Priority 3: Windows system env vars
  const winUser = (process.env.USERNAME || process.env.USER || "").trim();
  if (winUser && winUser.toLowerCase() !== "user") return winUser;

  // Fallback: hostname (clean, no "Unknown-" prefix)
  return deviceId;
}

const assignedEmployee = getAssignedEmployee();
const apiUrl = process.env.API_URL || "http://localhost:3000/api/heartbeat";

console.log(`🖥️  Device: ${deviceId}`);
console.log(`👤 Employee: ${assignedEmployee}`);
console.log(`🌐 API URL: ${apiUrl}\n`);

async function sendHeartbeat() {
  try {
    // Get local IP
    const localIP = Object.values(os.networkInterfaces())
      .flat()
      .find((i) => i.family === "IPv4" && !i.internal)?.address;

    // Get public IP
    const pubIP = await publicIp.v4();

    const cpus = os.cpus() || [];
    const systemInfo = {
      hostname: os.hostname(),
      username: os.userInfo().username,
      platform: os.platform(),
      type: os.type(),
      release: os.release(),
      arch: os.arch(),
      cpuModel: cpus.length ? cpus[0].model : "unknown",
      totalMem: os.totalmem(),
      freeMem: os.freemem(),
    };

    const payload = {
      deviceId,
      assignedEmployee,
      publicIP: pubIP,
      localIP,
      systemInfo,
    };

    const res = await axios.post(apiUrl, payload);
    console.log(`✅ [${new Date().toLocaleTimeString()}] Heartbeat sent:`, payload);
  } catch (err) {
    console.error(
      `❌ [${new Date().toLocaleTimeString()}] Heartbeat failed:`,
      err.message
    );
  }
}

// Send immediately
sendHeartbeat();

// Repeat every 30 seconds
setInterval(sendHeartbeat, 30000);