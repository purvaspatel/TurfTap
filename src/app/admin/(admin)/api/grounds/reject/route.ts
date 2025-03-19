import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { Ground } from "@/app/models/Ground";

export async function POST(req: Request) {
  await connectDB();
  const { id } = await req.json();

  await Ground.findByIdAndUpdate(id, { status: "rejected" });

  return NextResponse.json({ message: "Ground rejected" }, { status: 200 });
}
