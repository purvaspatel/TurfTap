import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { Comment } from "@/app/models/Comments";
import { Ground } from "@/app/models/Ground";
import { User } from "@/app/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import mongoose from "mongoose";

// POST: Create a new comment
export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { groundId, content, parentCommentId = null } = await req.json();
    
    if (!groundId || !content || content.trim() === "") {
      return NextResponse.json({ error: "Ground ID and content are required" }, { status: 400 });
    }

    // Verify ground exists
    const ground = await Ground.findById(groundId);
    if (!ground) {
      return NextResponse.json({ error: "Ground not found" }, { status: 404 });
    }

    // Verify parent comment exists if provided
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return NextResponse.json({ error: "Parent comment not found" }, { status: 404 });
      }
      
      // Ensure parent comment belongs to the same ground
      if (parentComment.groundId.toString() !== groundId) {
        return NextResponse.json({ error: "Parent comment must belong to the same ground" }, { status: 400 });
      }
    }

    // Create the comment
    const newComment = await Comment.create({
      groundId,
      userId: session.user.id,
      content,
      parentCommentId: parentCommentId || null,
      upvotes: 0,
      downvotes: 0
    });

    // Populate user information
    const populatedComment = await Comment.findById(newComment._id)
      .populate("userId", "name image")
      .lean();

    return NextResponse.json({ 
      message: "Comment added successfully", 
      comment: populatedComment 
    }, { status: 201 });
  } catch (error) {
    console.error("Comment creation error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET: Fetch comments for a ground
export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const groundId = url.searchParams.get("groundId");
    const commentId = url.searchParams.get("commentId");
    
    if (!groundId && !commentId) {
      return NextResponse.json({ error: "Ground ID or Comment ID is required" }, { status: 400 });
    }

    let comments;

    if (commentId) {
      // Get a specific comment
      comments = await Comment.findById(commentId)
        .populate("userId", "name image")
        .lean();
        
      if (!comments) {
        return NextResponse.json({ error: "Comment not found" }, { status: 404 });
      }
    } else {
      // Get all comments for a ground, including nested structure
      const allComments = await Comment.find({ groundId })
        .populate("userId", "name image")
        .sort({ createdAt: -1 })
        .lean();
      
      // Organize comments into a hierarchical structure
      const parentComments = allComments.filter(c => !c.parentCommentId);
      
      // Function to build comment tree
      const buildCommentTree = (comment: any): any => {
        const children = allComments.filter(c => 
          c.parentCommentId && c.parentCommentId.toString() === comment._id.toString()
        );
        
        return {
          ...comment,
          replies: children.map(buildCommentTree)
        };
      };
      
      comments = parentComments.map(buildCommentTree);
    }
    
    return NextResponse.json({ comments }, { status: 200 });
  } catch (error) {
    console.error("Comment fetch error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PATCH: Update a comment
export async function PATCH(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { commentId, content } = await req.json();
    
    if (!commentId || !content || content.trim() === "") {
      return NextResponse.json({ error: "Comment ID and content are required" }, { status: 400 });
    }

    // Find the comment
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Ensure user is the comment owner
    if (comment.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Not authorized to edit this comment" }, { status: 403 });
    }

    // Update the comment
    comment.content = content;
    await comment.save();

    // Return updated comment with user info
    const updatedComment = await Comment.findById(commentId)
      .populate("userId", "name image")
      .lean();

    return NextResponse.json({ 
      message: "Comment updated successfully", 
      comment: updatedComment 
    }, { status: 200 });
  } catch (error) {
    console.error("Comment update error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE: Remove a comment
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const commentId = url.searchParams.get("commentId");
    
    if (!commentId) {
      return NextResponse.json({ error: "Comment ID is required" }, { status: 400 });
    }

    // Find the comment
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Check if user is the comment owner
    const isOwner = comment.userId.toString() === session.user.id;
    
    // Alternatively, check if user is an admin
    const user = await User.findById(session.user.id);
    const isAdmin = user?.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Not authorized to delete this comment" }, { status: 403 });
    }

    // Find all child comments
    const findAllChildren = async (commentId: mongoose.Types.ObjectId) => {
      const childrenIds = [commentId];
      const children = await Comment.find({ parentCommentId: commentId });
      
      for (const child of children) {
        const nestedChildren = await findAllChildren(child._id);
        childrenIds.push(...nestedChildren);
      }
      
      return childrenIds;
    };
    
    const commentsToDelete = await findAllChildren(new mongoose.Types.ObjectId(commentId));
    
    // Delete all found comments
    await Comment.deleteMany({ _id: { $in: commentsToDelete } });

    return NextResponse.json({ 
      message: "Comment and all replies deleted successfully",
      deletedComments: commentsToDelete.length
    }, { status: 200 });
  } catch (error) {
    console.error("Comment delete error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}