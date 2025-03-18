"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="px-6 py-4 flex justify-between items-center bg-white border-b border-gray-100 shadow-sm">
      <Link href="/" className="text-lg font-medium text-gray-900">
        Turftap
      </Link>
      
      <div>
        {session ? (
          <div className="flex items-center gap-4">
            <Link href="/profile" className="flex items-center gap-2 text-sm text-gray-700">
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                {/* Regular img tag to avoid Next.js domain restrictions */}
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    className="w-full h-full object-cover"
                    alt="Profile"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                    {session.user?.name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              <span>{session.user?.name?.split(' ')[0]}</span>
            </Link>
            
            <Button 
              onClick={() => signOut()} 
              variant="outline" 
              className="text-sm text-gray-700 hover:bg-gray-100  px-4"
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <Button 
            onClick={() => signOut()} 
            className="bg-gray-900 hover:bg-black text-white  px-5 py-2 text-sm"
          >
            Sign In
          </Button>
        )}
      </div>
    </nav>
  );
}