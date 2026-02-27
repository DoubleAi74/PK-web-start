import { NextResponse } from "next/server";
import { getUserData } from "@/actions/getUserData";

// Note: params is the second argument
export async function GET(request, { params }) {
  // FIX: In Next.js 15, params is a Promise. You must await it.
  const { uid } = await params;

  console.log("Server received UID:", uid); // Check your terminal to see if this prints

  if (!uid) {
    return NextResponse.json({ error: "UID is required" }, { status: 400 });
  }

  const result = await getUserData(uid);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }

  return NextResponse.json(result.user);
}
