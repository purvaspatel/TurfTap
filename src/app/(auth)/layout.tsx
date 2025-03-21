"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthContent>{children}</AuthContent>
    </SessionProvider>
  );
}

// Separate component to use session hooks within the SessionProvider
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Navbar from "@/components/user/navbar";
function AuthContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!session) {
    redirect("/signin");
  }

  return (
    <>
    <Toaster position="top-right" />
    
      <Navbar />
      
      {children}
    </>
  );
}