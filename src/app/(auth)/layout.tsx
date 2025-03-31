"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import LoadingSpinner from "@/components/isLoading";
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
      <LoadingSpinner />
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