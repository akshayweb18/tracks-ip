import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Device from "@/models/Device";

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  // Validate required fields
  if (!body.deviceId || !body.assignedEmployee) {
    return NextResponse.json(
      { error: "deviceId and assignedEmployee are required" },
      { status: 400 }
    );
  }

  // Normalize inputs
  const rawDeviceId = (body.deviceId || "").toString().trim();
  const deviceId = rawDeviceId.toLowerCase();
  const rawAssigned = (body.assignedEmployee || "").toString().trim();
  const assignedEmployee = rawAssigned;

  // Reject default/invalid employee names
  if (!assignedEmployee || assignedEmployee.toLowerCase() === "user") {
    return NextResponse.json(
      { error: "assignedEmployee must be a valid name (not 'User' or empty)" },
      { status: 400 }
    );
  }

  try {
    // Upsert by normalized deviceId to avoid creating duplicate device documents
    const filter = { deviceId };
    const update = {
      deviceId,
      assignedEmployee,
      publicIP: body.publicIP,
      localIP: body.localIP,
      location: body.location,
      status: "Active",
      lastSeen: new Date(),
      ...(body.systemInfo ? { systemInfo: body.systemInfo } : {}),
    };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    const device = await Device.findOneAndUpdate(filter, update, options);

    return NextResponse.json(device);
  } catch (error) {
    console.error("Register API Error:", error);
    return NextResponse.json(
      { error: "Failed to register device" },
      { status: 500 }
    );
  }
}