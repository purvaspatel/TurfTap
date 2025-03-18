import mongoose, { Schema, Document, models } from "mongoose";

export interface IGround extends Document {
  title: string;
  description: string;
  category: string[];
  location: {
    address: string;
    state: string;
    city: string;
    lat: number;
    lng: number;
  };
  timings: string;
  isPaid: boolean;
  price?: number;
  images: string[];
  submittedBy: mongoose.Types.ObjectId;
  status: "pending" | "approved" | "rejected";
  remarks?: string;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
}

const GroundSchema = new Schema<IGround>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: [String], required: true },
  location: {
    address: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  timings: { type: String, required: true },
  isPaid: { type: Boolean, required: true },
  price: { type: Number, required: function () { return this.isPaid; } }, // Only required if paid
  images: { type: [String], required: true },
  submittedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  remarks: { type: String },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const Ground = models.Ground || mongoose.model<IGround>("Ground", GroundSchema);
