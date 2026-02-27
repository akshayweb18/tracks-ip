// heartbeat.js
import fetch from "node-fetch"; // or require("node-fetch")
import os from "os";

const deviceId = "LAPTOP-001";
const assignedEmployee = "Akshay";
const url = "http://localhost:3000/api/heartbeat"; // API endpoint

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

async function sendHeartbeat() {
  const localIP = getLocalIP();
  const publicIP = await getPublicIP();

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId, assignedEmployee, publicIP, localIP }),
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