// heartbeat.js
import fetch from "node-fetch";
import os from "os";
import { execSync } from "child_process";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Load .env.local FIRST so EMPLOYEE_NAME is available
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, ".env.local");
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
  // .env.local may not exist, continue without it
}

// Get actual system data instead of hardcoded values
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
const url = process.env.API_URL || "http://localhost:3000/api/heartbeat"; // API endpoint

console.log(`🖥️  Device: ${deviceId}`);
console.log(`👤 Employee: ${assignedEmployee}`);

function getLocalIP() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === "IPv4" && !net.internal) return net.address;
    }
  }
  return "0.0.0.0";
}

async function getPublicIP() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data.ip;
  } catch {
    return "0.0.0.0";
  }
}

function getSystemInfo() {
  const cpus = os.cpus() || [];
  const cpuModel = cpus.length ? cpus[0].model : "unknown";
  const totalMem = os.totalmem();
  const freeMem = os.freemem();

  // On Windows, optionally include `systeminfo` raw output for richer details
  let systeminfo = null;
  try {
    if (process.platform === "win32") {
      systeminfo = execSync("systeminfo", { timeout: 2000 }).toString();
    }
  } catch (e) {
    // ignore parse errors and timeouts
    systeminfo = null;
  }

  return {
    hostname: os.hostname(),
    username: os.userInfo().username,
    platform: os.platform(),
    type: os.type(),
    release: os.release(),
    arch: os.arch(),
    cpuModel,
    totalMem,
    freeMem,
    systeminfo,
  };
}

async function sendHeartbeat() {
  const localIP = getLocalIP();
  const publicIP = await getPublicIP();

  try {
    const systemInfo = getSystemInfo();

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId, assignedEmployee, publicIP, localIP, systemInfo }),
    });
    const data = await res.json();
    console.log("Heartbeat sent:", data);
  } catch (err) {
    console.error("Heartbeat failed:", err.message);
  }
}

// Run immediately and every 30 seconds
sendHeartbeat();
setInterval(sendHeartbeat, 30000);