import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Device from "@/models/Device";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const device = await Device.findOneAndUpdate(
      { deviceId: body.deviceId },
      {
        ...body,
        lastSeen: new Date(),
        status: "Active",
      },
      { upsert: true, new: true }
    );

    return NextResponse.json(device);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}