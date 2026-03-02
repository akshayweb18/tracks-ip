// laptop-agent/agent.js
const axios = require("axios");
const os = require("os");
const publicIp = require("public-ip");

async function sendHeartbeat() {
  try {
    // Get local IP
    const localIP = Object.values(os.networkInterfaces())
      .flat()
      .find((i) => i.family === "IPv4" && !i.internal)?.address;

    // Get public IP
    const pubIP = await publicIp.v4();

    // Device name = laptop name
    const deviceId = os.hostname();

    await axios.post("http://localhost:3000/api/heartbeat", { 
      deviceId,
      assignedEmployee: deviceId, // you can change this if needed
      publicIP: pubIP,
      localIP,
    });

    console.log("Heartbeat sent for", deviceId);
  } catch (err) {
    console.error("Heartbeat error:", err.message);
  }
}

// Send immediately
sendHeartbeat();

// Repeat every 30 seconds
setInterval(sendHeartbeat, 30000);