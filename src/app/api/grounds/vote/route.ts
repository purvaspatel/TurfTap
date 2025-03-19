import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { Vote } from "@/app/models/Vote";
import { Ground } from "@/app/models/Ground";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { groundId, voteType } = await req.json();
    if (!groundId || !["upvote", "downvote"].includes(voteType)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const userId = session.user.id;

    // Check if user has already voted
    const existingVote = await Vote.findOne({ userId, groundId });

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // User clicked the same vote → Remove it
        await Vote.deleteOne({ _id: existingVote._id });

        // Update Ground Vote Count
        if (voteType === "upvote") {
          await Ground.findByIdAndUpdate(groundId, { $inc: { upvotes: -1 } });
        } else {
          await Ground.findByIdAndUpdate(groundId, { $inc: { downvotes: -1 } });
        }

        return NextResponse.json({ message: "Vote removed", userVote: null }, { status: 200 });
      } else {
        // User switched vote → Update it
        existingVote.voteType = voteType;
        await existingVote.save();

        // Update Ground Vote Count
        if (voteType === "upvote") {
          await Ground.findByIdAndUpdate(groundId, { $inc: { upvotes: 1, downvotes: -1 } });
        } else {
          await Ground.findByIdAndUpdate(groundId, { $inc: { downvotes: 1, upvotes: -1 } });
        }

        return NextResponse.json({ message: "Vote updated", userVote: voteType }, { status: 200 });
      }
    }

    // User is voting for the first time
    await Vote.create({ userId, groundId, voteType });

    // Update Ground Vote Count
    if (voteType === "upvote") {
      await Ground.findByIdAndUpdate(groundId, { $inc: { upvotes: 1 } });
    } else {
      await Ground.findByIdAndUpdate(groundId, { $inc: { downvotes: 1 } });
    }

    return NextResponse.json({ message: "Vote added", userVote: voteType }, { status: 201 });
  } catch (error) {
    console.error("Vote API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Also add this endpoint to get user's votes for initial load
export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const url = new URL(req.url);
    const groundId = url.searchParams.get("groundId");
    
    if (!groundId) {
      // Get all votes by this user
      const votes = await Vote.find({ userId: session.user.id });
      return NextResponse.json({ votes }, { status: 200 });
    } else {
      // Get specific vote
      const vote = await Vote.findOne({ userId: session.user.id, groundId });
      return NextResponse.json({ vote }, { status: 200 });
    }
  } catch (error) {
    console.error("Vote API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}