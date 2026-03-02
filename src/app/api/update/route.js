// // app/api/update/route.ts
// import { NextResponse } from "next/server";

// // GET request handler
// export async function GET(req: Request) {
//   return NextResponse.json({ message: "Update API GET works" });
// }

// // POST request handler
// export async function POST(req: Request) {
//   const data = await req.json();
//   // handle your update logic here, e.g., update DB
//   return NextResponse.json({ success: true, data });
// }
import { NextResponse } from "next/server";

// GET request handler
export async function GET(req) {
  return NextResponse.json({ message: "Update API GET works" });
}

// POST request handler
export async function POST(req) {
  try {
    const data = await req.json();

    // Your update logic here

    return NextResponse.json({
      success: true,
      data,
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 }
    );
  }
}
