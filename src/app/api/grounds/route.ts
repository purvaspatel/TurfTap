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

  // Pagination
  const page = Number(url.searchParams.get("page")) || 1;
  const limit = 24;
  const skip = (page - 1) * limit;

  // Filters (Optional)
  const sport = url.searchParams.get("sport");
  const city = url.searchParams.get("city");
  const state = url.searchParams.get("state");
  const country = url.searchParams.get("country");
  const sortBy = url.searchParams.get("sort") || "new"; // Default: Show latest first

  // Build dynamic filter
  const filter: any = { status: "approved" };  

  // Sport filter - now works with both array elements and partial matches
  if (sport && sport !== "all") {
    filter.category = { $elemMatch: { $regex: new RegExp(sport, "i") } }; // Matches any category containing sport
  }

  // Location filters
  if (city && city !== "all") {
    filter["location.city"] = { $regex: new RegExp(`^${city}$`, "i") }; // Case-insensitive exact city match
  }

  if (state && state !== "all") {
    filter["location.state"] = { $regex: new RegExp(`^${state}$`, "i") }; // Case-insensitive exact state match
  }

  if (country && country !== "all") {
    filter["location.country"] = { $regex: new RegExp(`^${country}$`, "i") }; // Case-insensitive exact country match
  }

  // Sorting Logic
  const sortOptions: any = { createdAt: -1 }; // Default: Show latest first
  if (sortBy === "top") sortOptions.upvotes = -1; // Sort by upvotes

  // Fetch grounds with filters & sorting
  const totalGrounds = await Ground.countDocuments(filter);
  const totalPages = Math.ceil(totalGrounds / limit);

  const grounds = await Ground.find(filter)
    .populate("submittedBy", "name")
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  console.log(grounds);
  return NextResponse.json({ grounds, totalPages }, { status: 200 });
}