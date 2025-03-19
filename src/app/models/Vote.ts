import mongoose, { Schema, Document, models } from "mongoose";

export interface IVote extends Document {
  userId: mongoose.Types.ObjectId;
  groundId: mongoose.Types.ObjectId;
  voteType: "upvote" | "downvote";
}

const VoteSchema = new Schema<IVote>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  groundId: { type: Schema.Types.ObjectId, ref: "Ground", required: true },
  voteType: { type: String, enum: ["upvote", "downvote"], required: true },
});

export const Vote = models.Vote || mongoose.model<IVote>("Vote", VoteSchema);
