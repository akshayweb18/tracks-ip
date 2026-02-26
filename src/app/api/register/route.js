import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Device from "@/models/Device";

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  const device = await Device.create({
    ...body,
    status: "online",
    lastActive: new Date(),
  });

  return NextResponse.json(device);
}