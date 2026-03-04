import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Device from "@/models/Device";

export async function GET() {
  try {
    await connectDB();

    // Aggregate to return one (most-recent) document per IP to avoid duplicates
    const devices = await Device.aggregate([
      // Filter out invalid/incomplete records: must have deviceId and valid assignedEmployee
      {
        $match: {
          deviceId: { $exists: true, $ne: null, $ne: "" },
          assignedEmployee: { $exists: true, $ne: null, $ne: "", $ne: "User" },
          publicIP: { $exists: true, $ne: null, $ne: "" }, // Must have IP
        },
      },
      { $sort: { lastSeen: -1 } }, // newest first
      // Group by publicIP to deduplicate by IP (show only latest device per IP)
      {
        $group: {
          _id: "$publicIP",
          doc: { $first: "$$ROOT" },
        },
      },
      { $replaceRoot: { newRoot: "$doc" } },
      { $sort: { lastSeen: -1 } },
    ]);

    const now = Date.now();

    const updatedDevices = devices.map((device) => {
      const lastSeenTime = new Date(device.lastSeen).getTime();
      const diff = now - lastSeenTime;

      return {
        ...device,
        status: diff > 60000 ? "Inactive" : "Active", // 60 sec rule
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