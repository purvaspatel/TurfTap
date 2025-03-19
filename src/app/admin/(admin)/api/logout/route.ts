// app/admin/api/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // Delete the admin_auth cookie
  (await cookies()).delete("admin_auth");
  
  // Set cache control headers to prevent caching
  return NextResponse.json(
    { message: "Logged out" }, 
    { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    }
  );
}