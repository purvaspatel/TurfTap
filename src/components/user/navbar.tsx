"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils"; // Helper for conditional classNames

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname(); // Get current route

  return (
    <nav className="px-6 py-4 flex justify-between items-center bg-white border-b ">
      {/* Left Side (Logo + Turftap) */}
      <Link href="/sports" className="flex items-center gap-2">
        <Image src="/TurfTapLogo.png" alt="Turftap Logo" width={32} height={32} />
        <span className="text-lg font-semibold text-gray-900">Turftap</span>
      </Link>

      {/* Center (Navigation Links) */}
      <div className="flex space-x-6">
        <Link
          href="/sports"
          className={cn(
            "text-sm font-medium px-3 py-2 rounded-md transition-colors",
            pathname === "/sports"
              ? "border border-green-500 text-green-600"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          Explore
        </Link>

        <Link
          href="/top-contributors"
          className={cn(
            "text-sm font-medium px-3 py-2 rounded-md transition-colors",
            pathname === "/top-contributors"
              ? "border border-green-500 text-green-600"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          Top Contributors
        </Link>

        <Link
          href="/vision"
          className={cn(
            "text-sm font-medium px-3 py-2 rounded-md transition-colors",
            pathname === "/vision"
              ? "border border-green-500 text-green-600"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          Our Vision
        </Link>

        {session && (
          <Link
            href="/grounds/create"
            className={cn(
              "text-sm font-medium px-3 py-2 rounded-md transition-colors",
              pathname === "/grounds/create"
                ? "border border-green-500 text-green-600"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            Contribute
          </Link>
        )}
        
      </div>

      {/* Right Side (Profile & Auth) */}
      <div className="flex items-center gap-4">
        {session ? (
          <>
            {/* Profile */}
            <Link href="/profile" className="flex items-center gap-2 text-sm text-gray-700">
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                    alt="Profile"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                    {session.user?.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>
              <span>{session.user?.name?.split(" ")[0]}</span>
            </Link>

            {/* Sign Out Button */}
            <Button
              onClick={() => signOut()}
              variant="outline"
              className="text-sm text-gray-700 hover:bg-gray-100 px-4"
            >
              Sign Out
            </Button>
          </>
        ) : (
          <Button
            onClick={() => signIn("google")}
            className="bg-gray-900 hover:bg-black text-white px-5 py-2 text-sm"
          >
            Sign In
          </Button>
        )}
        <Link
          href="/help"
          className={cn(
            "text-sm font-medium px-3 py-2 rounded-md transition-colors",
            pathname === "/grounds/help"
              ? "border border-green-500 text-green-600"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          Help
        </Link>
      </div>
    </nav>
  );
}
