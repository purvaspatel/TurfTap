"use client";

import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/user/navbar";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <SessionProvider>
    <Navbar/>
    
    {children}
    </SessionProvider>;
}
