import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Device from "@/models/Device";

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  const device = await Device.findOne({ deviceId: body.deviceId });

  if (!device) {
    return NextResponse.json({ error: "Device not found" }, { status: 404 });
  }

  device.publicIP = body.publicIP;
  device.location = body.location;
  device.status = "online";
  device.lastActive = new Date();

  device.ipHistory.push({
    ip: body.publicIP,
    location: body.location,
    timestamp: new Date(),
  });

  await device.save();

  return NextResponse.json(device);
}