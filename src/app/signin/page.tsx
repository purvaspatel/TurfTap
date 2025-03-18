"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <Card className="w-full max-w-md p-8 shadow-sm border border-gray-100">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo */}
          <div className="rounded-full bg-gray-50 p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-800"
            >
              <path d="M2 22v-5l5-5 5 5-5 5z" />
              <path d="M9.5 14.5 16 8" />
              <path d="M17 2v5h5" />
              <path d="M14 7l3-3" />
            </svg>
          </div>
          
          {/* Title and Description */}
          <div className="text-center space-y-1">
            <h2 className="text-xl font-medium text-gray-900">Turftap</h2>
            <p className="text-sm text-gray-500">Continue with your account</p>
          </div>
          
          {/* Sign in Button */}
          <Button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full rounded-full flex items-center justify-center space-x-2 bg-gray-900 hover:bg-black text-white py-5"
            variant="default"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              className="mr-2"
            >
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </Button>
          
          {/* Footer Text */}
          <p className="text-xs text-gray-400 pt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </Card>
    </div>
  );
}