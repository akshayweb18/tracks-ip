import { NextResponse } from "next/server";

function randomIP() {
  return `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
}

function randomStatus() {
  return Math.random() > 0.4 ? "online" : "offline";
}

const cities = [
  "Mumbai, Maharashtra",
  "Pune, Maharashtra",
  "Delhi, India",
  "Bangalore, Karnataka",
  "Hyderabad, Telangana",
  "Chennai, Tamil Nadu",
];

const employees = [
  "Akshay Chaudhari",
  "Rahul Sharma",
  "Priya Mehta",
  "Neha Patil",
  "Amit Verma",
  "Sneha Joshi",
  "Rohit Singh",
  "Karan Desai",
  "Anjali Gupta",
  "Vikram Rao",
];

export async function GET() {
  const dummyDevices = Array.from({ length: 50 }).map((_, i) => ({
    _id: `${i + 1}`,
    deviceId: `LAPTOP-${1000 + i}`,
    serialNumber: `SN-${2000 + i}`,
    assignedEmployee:
      employees[Math.floor(Math.random() * employees.length)],
    publicIP: randomIP(),
    location: cities[Math.floor(Math.random() * cities.length)],
    status: randomStatus(),
    lastActive: new Date(
      Date.now() - Math.floor(Math.random() * 10000000)
    ),
  }));

  return NextResponse.json(dummyDevices);
}