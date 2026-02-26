import { NextResponse } from "next/server";

// Some sample names and locations to randomize
const employeeNames = [
  "Akshay","Rahul","Priya","Sonia","Vikram","Neha","Rohit","Anita","Manish","Divya",
  "Karan","Simran","Ramesh","Pooja","Amit","Richa","Sandeep","Megha","Raj","Sneha"
];

const locations = [
  "Mumbai, Maharashtra","Pune, Maharashtra","Delhi, India","Bangalore, Karnataka",
  "Chennai, Tamil Nadu","Hyderabad, Telangana","Kolkata, West Bengal",
  "Ahmedabad, Gujarat","Jaipur, Rajasthan","Lucknow, Uttar Pradesh"
];

const statuses = ["online", "offline"];

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Generate 80 unique devices
export async function GET() {
  const dummyDevices = [];

  for (let i = 1; i <= 80; i++) {
    const randomName = getRandomItem(employeeNames);
    const randomLocation = getRandomItem(locations);
    const randomStatus = getRandomItem(statuses);
    const randomIP = `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;

    dummyDevices.push({
      _id: i.toString(),
      deviceId: `LAPTOP-${String(i).padStart(3, "0")}`,
      assignedEmployee: randomName,
      publicIP: randomIP,
      location: randomLocation,
      status: randomStatus,
      lastActive: new Date(),
    });
  }

  return NextResponse.json(dummyDevices);
}