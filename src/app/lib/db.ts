import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in your environment variables.");
}

interface MongooseConnection {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

declare global {
  var mongooseConnection: MongooseConnection;
}

let cached: MongooseConnection = global.mongooseConnection || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "turftap",
      bufferCommands: false,
    }).then((mongoose) => mongoose.connection);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

if (process.env.NODE_ENV !== "production") {
  global.mongooseConnection = cached;
}
