// app/admin/(admin)/dashboard/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const router = useRouter();

  // Add this to prevent browser back after logout
  useEffect(() => {
    // Disable browser back button after logout
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function() {
      window.history.pushState(null, "", window.location.href);
    };

    return () => {
      window.onpopstate = null;
    };
  }, []);

  async function handleLogout() {
    try {
      await fetch("/admin/api/logout", { 
        method: "POST",
        cache: "no-store" 
      });
      
      // Clear any client-side state if you have any
      
      toast.success("Logged out successfully");
      
      // Force a hard navigation instead of client-side routing
      window.location.href = "/admin/login";
    } catch (error) {
      toast.error("Logout failed");
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
        <Button variant="destructive" onClick={handleLogout}>Logout</Button>
      </div>
      <a href='admin/submissions'>View User Submissions</a>
    </div>
  );
}