// src/app/api/heartbeat/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Device from "@/models/Device";

export async function POST(req) {
  try {
    const body = await req.json();
    await connectDB();

    const updatedDevice = await Device.findOneAndUpdate(
      { deviceId: body.deviceId }, // unique identifier
      {
        assignedEmployee: body.assignedEmployee,
        publicIP: body.publicIP,
        localIP: body.localIP,
        lastSeen: new Date(),
      },
      { upsert: true, returnDocument: "after" } // create if not exists
    );

    return NextResponse.json(updatedDevice);
  } catch (err) {
    console.error("Heartbeat API Error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}