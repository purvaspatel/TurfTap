import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  // Check credentials (either from ENV or MongoDB)
  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Set cookie for authentication
  const cookieStore = await cookies();
  cookieStore.set("admin_auth", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
  });

  return NextResponse.json({ message: "Login successful" }, { status: 200 });
}
