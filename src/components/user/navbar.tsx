"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils"; // Helper for conditional classNames
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname(); // Get current route
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Links to be shown in navigation
  const navLinks = [
    { href: "/sports", label: "Explore" },
    { href: "/top-contributors", label: "Top Contributors" },
    { href: "/vision", label: "Our Vision" },
    ...(session ? [{ href: "/grounds/create", label: "Contribute" }] : []),
  ];

  return (
    <nav className="px-6 py-4 flex justify-between items-center bg-white border-b relative">
      {/* Left Side (Logo + Turftap) */}
      <Link href="/sports" className="flex items-center gap-2 z-10">
        <Image src="/TurfTapLogo.png" alt="Turftap Logo" width={32} height={32} />
        <span className="text-lg font-semibold text-gray-900">Turftap</span>
      </Link>

      {/* Hamburger Menu (Mobile Only) */}
      {isMobile && (
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="z-10"
          aria-label="Toggle menu"
        >
          <Menu size={24} className="text-gray-700" />
        </button>
      )}

      {/* Desktop Navigation */}
      {!isMobile && (
        <>
          {/* Center (Navigation Links) */}
          <div className="flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium px-3 py-2 rounded-md transition-colors",
                  pathname === link.href
                    ? "border border-green-500 text-green-600"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {link.label}
              </Link>
            ))}
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

                <Link
                  href="/grounds/u"
                  className={cn(
                    "text-sm font-medium px-3 py-2 rounded-md transition-colors",
                    pathname === "/grounds/u"
                      ? "border border-green-500 text-green-600"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  Status
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
        </>
      )}

      {/* Mobile Menu Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-20 pt-16 px-6">
          <div className="flex flex-col space-y-4">
            {/* Navigation Links */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "text-lg font-medium py-3 border-b border-gray-100",
                  pathname === link.href
                    ? "text-green-600"
                    : "text-gray-800"
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* Help Link */}
            <Link
              href="/help"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "text-lg font-medium py-3 border-b border-gray-100",
                pathname === "/grounds/help"
                  ? "text-green-600"
                  : "text-gray-800"
              )}
            >
              Help
            </Link>

            {/* Profile Link (if logged in) */}
            {session && (
              <Link
                href="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium py-3 border-b border-gray-100 flex items-center gap-3"
              >
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
                <span>{session.user?.name}</span>
              </Link>
            )}

            {/* Auth Button */}
            <div className="pt-4">
              {session ? (
                <Button
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-gray-100 text-gray-800 hover:bg-gray-200"
                >
                  Sign Out
                </Button>
              ) : (
                <Button
                  onClick={() => signIn("google")}
                  className="w-full bg-gray-900 hover:bg-black text-white"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}