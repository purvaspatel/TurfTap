import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { Ground } from "@/app/models/Ground";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function POST(req: Request) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, category, location, timings, isPaid, price, images } = body;

    if (!title || !description || !category || !location || !timings || !images.length) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const newGround = await Ground.create({
      title,
      description,
      category,
      location,
      timings,
      isPaid,
      price: isPaid ? price : 0,
      images,
      submittedBy: session.user.id,
      status: "pending",
    });

    return NextResponse.json({ message: "Request submitted for review", ground: newGround }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
  }
}
