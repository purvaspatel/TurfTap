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

  const body = await req.json();
  const { title, description, category, location, timings, isPaid, price, images } = body;

  try {
    const newGround = await Ground.create({
      title,
      description,
      category,
      location,
      timings,
      isPaid,
      price,
      images,
      submittedBy: session.user.id, 
      status: "pending",
    });

    return NextResponse.json({ message: "Request submitted for review." }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
  }
}


export async function GET(req: Request) {
  await connectDB();

  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;

  const totalGrounds = await Ground.countDocuments({ status: "approved" });
  const totalPages = Math.ceil(totalGrounds / limit);

  const grounds = await Ground.find({ status: "approved" })
    .populate("submittedBy", "name") // Fetch username
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return NextResponse.json({ grounds, totalPages }, { status: 200 });
}

