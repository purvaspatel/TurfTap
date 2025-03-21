import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { Ground } from "@/app/models/Ground";

export async function GET() {
  await connectDB();

  // Get unique cities and states
  const locations = await Ground.aggregate([
    { $match: { status: "approved" } },
    {
      $group: {
        _id: { city: "$location.city", state: "$location.state" },
      },
    },
    {
      $project: {
        city: "$_id.city",
        state: "$_id.state",
        _id: 0,
      },
    },
  ]);

  return NextResponse.json({ locations }, { status: 200 });
}
