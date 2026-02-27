const axios = require("axios");
const os = require("os");

async function getPublicIP() {
  try {
    const res = await axios.get("https://api.ipify.org?format=json");
    return res.data.ip;
  } catch (err) {
    console.log("Failed to get public IP");
    return "Unknown";
  }
}

async function sendHeartbeat() {
  try {
    const localIP = Object.values(os.networkInterfaces())
      .flat()
      .find((i) => i.family === "IPv4" && !i.internal)?.address;

    const publicIP = await getPublicIP();

    await axios.post("http://localhost:3000/api/heartbeat", {
      deviceId: os.hostname(),
      assignedEmployee: "Akshay",
      publicIP,
      localIP,
    });

    console.log("Heartbeat sent");
  } catch (err) {
    console.log("Error:", err.message);
  }
}

setInterval(sendHeartbeat, 30000);
sendHeartbeat();