import mongoose, { Schema, Document, models } from "mongoose";

export interface IComment extends Document {
  groundId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  content: string;
  parentCommentId?: mongoose.Types.ObjectId;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>({
  groundId: { type: Schema.Types.ObjectId, ref: "Ground", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  parentCommentId: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const Comment = models.Comment || mongoose.model<IComment>("Comment", CommentSchema);
