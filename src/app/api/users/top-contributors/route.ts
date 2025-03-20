// app/api/users/top-contributors/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { User } from "@/app/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function GET(req: Request) {
  try {
    // Connect to database
    await connectDB();
    
    // Get pagination parameters from the URL
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    
    // Validate pagination parameters
    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1 || limit > 50) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 }
      );
    }
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Get total count for pagination
    const totalUsersCount = await User.countDocuments();
    const totalPages = Math.ceil(totalUsersCount / limit);
    
    // Fetch users sorted by turftapPoints in descending order
    const users = await User.find({})
      .sort({ turftapPoints: -1 })
      .skip(skip)
      .limit(limit)
      .select("_id name profileImage turftapPoints")
      .lean();
    
    return NextResponse.json({
      users,
      totalPages,
      currentPage: page,
      totalUsers: totalUsersCount
    });
    
  } catch (error) {
    console.error("Error fetching top contributors:", error);
    return NextResponse.json(
      { error: "Failed to fetch top contributors" },
      { status: 500 }
    );
  }
}