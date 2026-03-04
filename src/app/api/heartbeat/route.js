// // src/app/api/heartbeat/route.js
// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import Device from "@/models/Device";

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     await connectDB();

//     const updatedDevice = await Device.findOneAndUpdate(
//       { deviceId: body.deviceId }, // unique identifier
//       {
//         assignedEmployee: body.assignedEmployee,
//         publicIP: body.publicIP,
//         localIP: body.localIP,
//         lastSeen: new Date(),
//       },
//       { upsert: true, returnDocument: "after" } // create if not exists
//     );

//     return NextResponse.json(updatedDevice);
//   } catch (err) {
//     console.error("Heartbeat API Error:", err);
//     return NextResponse.json({ error: "Failed" }, { status: 500 });
//   }
// }import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import Device from "@/models/Device";

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const { deviceId, assignedEmployee, publicIP, localIP } = body;

//     await connectDB();

//     const updatedDevice = await Device.findOneAndUpdate(
//       { deviceId },
//       { assignedEmployee, publicIP, localIP, lastSeen: new Date(), status: "Active" },
//       { upsert: true, returnDocument: "after" }
//     );

//     return NextResponse.json(updatedDevice);
//   } catch (err) {
//     console.error("Heartbeat API POST Error:", err);
//     return NextResponse.json({ error: "Failed" }, { status: 500 });
//   }
// }

// // 👇 Add GET handler
// export async function GET() {
//   try {
//     await connectDB();
//     const devices = await Device.find().sort({ lastSeen: -1 }); // latest first
//     return NextResponse.json(devices);
//   } catch (err) {
//     console.error("Heartbeat API GET Error:", err);
//     return NextResponse.json({ error: "Failed" }, { status: 500 });
//   }
// }

// src/app/api/heartbeat/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Device from "@/models/Device";

export async function POST(req) {
  try {
    const body = await req.json();

    // Normalize inputs
    const rawDeviceId = (body.deviceId || "").toString().trim();
    const deviceId = rawDeviceId.toLowerCase();
    const assignedEmployee = (body.assignedEmployee || "").toString().trim();
    const publicIP = body.publicIP;
    const localIP = body.localIP;

    // Validate required fields
    if (!deviceId || !assignedEmployee) {
      return NextResponse.json(
        { error: "deviceId and assignedEmployee are required" },
        { status: 400 }
      );
    }

    // Reject default/invalid employee names
    if (assignedEmployee.toLowerCase() === "user" || assignedEmployee === "") {
      return NextResponse.json(
        { error: "assignedEmployee must be a valid name (not 'User' or empty)" },
        { status: 400 }
      );
    }

    await connectDB();

    const updatedDevice = await Device.findOneAndUpdate(
      { deviceId },
      {
        deviceId,
        assignedEmployee,
        publicIP,
        localIP,
        lastSeen: new Date(),
        status: "Active",
        ...(body.systemInfo ? { systemInfo: body.systemInfo } : {}),
      },
      { upsert: true, returnDocument: "after" }
    );

    return NextResponse.json(updatedDevice);
  } catch (err) {
    console.error("Heartbeat API POST Error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// GET handler
export async function GET() {
  try {
    await connectDB();
    const devices = await Device.find().sort({ lastSeen: -1 }); // latest first
    return NextResponse.json(devices);
  } catch (err) {
    console.error("Heartbeat API GET Error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}