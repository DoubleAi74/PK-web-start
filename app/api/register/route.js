// app/api/user/create/route.js
import { NextResponse } from "next/server";
import { createUserRecord } from "@/actions/getUserData";

// Helper function to set CORS headers
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*", // Allow any origin (app, browser, localhost)
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

// 1. Handle OPTIONS (The Preflight Check)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

// 2. Keep GET (For your browser test)
export async function GET() {
  return NextResponse.json(
    { message: "Connection successful! The API is live." },
    { headers: corsHeaders() },
  );
}

// 3. Handle POST (The actual User Creation)
export async function POST(request) {
  try {
    const body = await request.json();
    const { firebaseUid, email, targetDays } = body;

    // Validate
    if (!firebaseUid || !email || !targetDays) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400, headers: corsHeaders() },
      );
    }

    // Action
    const result = await createUserRecord(
      firebaseUid,
      email,
      parseInt(targetDays, 10),
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400, headers: corsHeaders() },
      );
    }

    return NextResponse.json(result.user, {
      status: 201,
      headers: corsHeaders(),
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: corsHeaders() },
    );
  }
}
