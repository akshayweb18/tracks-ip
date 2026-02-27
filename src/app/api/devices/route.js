import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Device from "@/models/Device";

export async function GET() {
  try {
    await connectDB();

    const devices = await Device.find().lean(); // 👈 important (returns plain object)

    const now = Date.now();

    const updatedDevices = devices.map((device) => {
      const lastSeenTime = new Date(device.lastSeen).getTime();
      const diff = now - lastSeenTime;

      return {
        ...device,
        status: diff > 60000 ? "Offline" : "Active", // 60 sec rule
      };
    });

    return NextResponse.json(updatedDevices);
  } catch (error) {
    console.error("Devices API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch devices" },
      { status: 500 }
    );
  }
}