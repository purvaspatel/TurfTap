"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MoreHorizontal, Send, Edit, Trash2, Reply, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CommentUser {
  _id: string;
  name: string;
  image?: string;
}

interface CommentType {
  _id: string;
  groundId: string;
  userId: CommentUser;
  content: string;
  parentCommentId?: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  replies?: CommentType[];
}

interface CommentsProps {
  groundId: string;
}

export default function Comments({ groundId }: CommentsProps) {
  const { data: session, status } = useSession();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  
  // Fetch comments
  useEffect(() => {
    fetchComments();
  }, [groundId]);
  
  // Focus on input when replying
  useEffect(() => {
    if (replyingTo && commentInputRef.current) {
      commentInputRef.current.focus();
    }
  }, [replyingTo]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/grounds/comments?groundId=${groundId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (parentId: string | null = null) => {
    if (!session) {
      toast.error("Please sign in to comment");
      return;
    }
    
    const content = parentId ? newComment : newComment;
    if (!content.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    
    try {
      const res = await fetch("/api/grounds/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groundId,
          content,
          parentCommentId: parentId,
        }),
      });
      
      if (!res.ok) throw new Error("Failed to add comment");
      
      const data = await res.json();
      
      // Update state with new comment
      if (parentId) {
        // For replies, update the nested structure
        const updateCommentsWithReply = (comments: CommentType[]): CommentType[] => {
          return comments.map(comment => {
            if (comment._id === parentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), data.comment],
              };
            } else if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: updateCommentsWithReply(comment.replies),
              };
            }
            return comment;
          });
        };
        
        setComments(updateCommentsWithReply(comments));
        setReplyingTo(null);
      } else {
        // For top-level comments, add to the beginning
        setComments([{ ...data.comment, replies: [] }, ...comments]);
      }
      
      setNewComment("");
      toast.success("Comment added");
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to add comment");
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    
    try {
      const res = await fetch("/api/grounds/comments", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentId,
          content: editContent,
        }),
      });
      
      if (!res.ok) throw new Error("Failed to update comment");
      
      const data = await res.json();
      
      // Update state with edited comment
      const updateEditedComment = (comments: CommentType[]): CommentType[] => {
        return comments.map(comment => {
          if (comment._id === commentId) {
            return {
              ...comment,
              content: data.comment.content,
            };
          } else if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: updateEditedComment(comment.replies),
            };
          }
          return comment;
        });
      };
      
      setComments(updateEditedComment(comments));
      setEditingComment(null);
      setEditContent("");
      toast.success("Comment updated");
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error("Failed to update comment");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment? This will also remove all replies.")) {
      return;
    }
    
    try {
      const res = await fetch(`/api/grounds/comments?commentId=${commentId}`, {
        method: "DELETE",
      });
      
      if (!res.ok) throw new Error("Failed to delete comment");
      
      // Update state by removing the comment and its replies
      const removeComment = (comments: CommentType[]): CommentType[] => {
        return comments.filter(comment => {
          if (comment._id === commentId) {
            return false;
          } else if (comment.replies && comment.replies.length > 0) {
            comment.replies = removeComment(comment.replies);
          }
          return true;
        });
      };
      
      setComments(removeComment(comments));
      toast.success("Comment deleted");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  const startEditing = (comment: CommentType) => {
    setEditingComment(comment._id);
    setEditContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingComment(null);
    setEditContent("");
  };

  const startReplying = (commentId: string) => {
    setReplyingTo(commentId);
    setNewComment("");
  };

  const cancelReplying = () => {
    setReplyingTo(null);
    setNewComment("");
  };

  const renderComment = (comment: CommentType, level = 0) => {
    const isEditing = editingComment === comment._id;
    const isReplying = replyingTo === comment._id;
    const isOwner = session?.user?.id === comment.userId._id;
    
    return (
      <div key={comment._id} className={`p-4 border rounded-lg my-3 ${level > 0 ? `ml-${Math.min(level * 4, 12)}` : ''}`}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            {comment.userId.image ? (
              <Image 
                src={comment.userId.image} 
                alt={comment.userId.name} 
                width={32} 
                height={32} 
                className="rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm">
                {comment.userId.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-medium">@{comment.userId.name}</p>
              <p className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => startEditing(comment)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDeleteComment(comment._id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        {isEditing ? (
          <div className="mt-2">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[100px] mb-2"
              placeholder="Edit your comment..."
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={cancelEditing}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => handleEditComment(comment._id)}>
                Save
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-gray-700 whitespace-pre-line">{comment.content}</p>
            
            <div className="mt-2 flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => startReplying(comment._id)}
                disabled={!session}
                className="text-xs"
              >
                <Reply className="mr-1 h-3 w-3" />
                Reply
              </Button>
            </div>
          </>
        )}
        
        {isReplying && (
          <div className="mt-3 pl-4 border-l-2">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm text-gray-600">Replying to @{comment.userId.name}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={cancelReplying} 
                className="h-6 w-6 p-0 rounded-full"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Textarea
                ref={commentInputRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a reply..."
                className="text-sm min-h-[80px]"
              />
              <Button 
                size="sm" 
                onClick={() => handleAddComment(comment._id)}
                className="self-end"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        
        {/* Render replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 space-y-3">
            {comment.replies.map((reply) => renderComment(reply, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>
      
      {/* Comment input */}
      {session ? (
        <div className="mb-6 flex gap-3">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Join the conversation..."
            className="min-h-[100px]"
          />
          <Button 
            onClick={() => handleAddComment(null)}
            className="self-end"
          >
            <Send className="mr-2 h-4 w-4" />
            Post
          </Button>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
          <p>Please sign in to join the conversation</p>
        </div>
      )}
      
      {/* Comments list */}
      {loading ? (
        <p className="text-center py-4">Loading comments...</p>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => renderComment(comment))}
        </div>
      ) : (
        <p className="text-center py-4 text-gray-500">
          No comments yet. Be the first to comment!
        </p>
      )}
    </div>
  );
}