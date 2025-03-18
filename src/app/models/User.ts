import mongoose, { Schema, Document, models } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  googleId: string;
  profileImage: string;
  turftapPoints: number;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  googleId: { type: String, required: true, unique: true },
  profileImage: { type: String },
  turftapPoints: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const User = models.User || mongoose.model<IUser>("User", UserSchema);
