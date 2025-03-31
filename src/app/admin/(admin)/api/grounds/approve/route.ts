import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { Ground } from "@/app/models/Ground";
import { User } from "@/app/models/User"; 
import { cookies } from "next/headers";

export async function POST(req: Request) {
  await connectDB();
  const adminAuth = (await cookies()).get("admin_auth");
  if (!adminAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();

  const ground = await Ground.findById(id);
  if (!ground) {
    return NextResponse.json({ error: "Ground not found" }, { status: 404 });
  }

  await Ground.findByIdAndUpdate(id, { status: "approved" });
  const user = await User.findById(ground.submittedBy);
  if (user) {
    user.turftapPoints = (user.turftapPoints || 0) + 3; // Default to 0 if undefined
    await user.save();
  }

  return NextResponse.json({ message: "Ground approved and points awarded" }, { status: 200 });
}


