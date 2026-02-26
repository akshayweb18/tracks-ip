const axios = require("axios");
const os = require("os");
const { execSync } = require("child_process");

const SERVER_URL = "http://localhost:3000/api/update";

async function getPublicIP() {
  const res = await axios.get("https://api.ipify.org?format=json");
  return res.data.ip;
}

async function getLocation(ip) {
  const res = await axios.get(`http://ip-api.com/json/${ip}`);
  return `${res.data.city}, ${res.data.regionName}`;
}

async function sendUpdate() {
  const ip = await getPublicIP();
  const location = await getLocation(ip);

  await axios.post(SERVER_URL, {
    deviceId: os.hostname(),
    serialNumber: os.hostname(),
    assignedEmployee: "Akshay",
    publicIP: ip,
    location,
  });

  console.log("Device updated");
}

setInterval(sendUpdate, 60000);
sendUpdate();