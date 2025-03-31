"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function LoadingSpinner() {
  // Sports quotes array
  const sportsQuotes = [
    "Champions keep playing until they get it right. — Billie Jean King",
    "It's not whether you get knocked down, it's whether you get up. — Vince Lombardi",
    "The more difficult the victory, the greater the happiness in winning. — Pelé",
    "You miss 100% of the shots you don't take. — Wayne Gretzky",
    "The only way to prove you're a good sport is to lose. — Ernie Banks",
    "Every champion was once a contender who refused to give up. — Rocky Balboa",
    "Find the game where you can shine. — Sachin Tendulkar",
    "Hard work beats talent when talent doesn't work hard. — Tim Notke",
    "Champions aren't made in gyms. They are made from something deep inside them. — Muhammad Ali",
    "The difference between the impossible and the possible lies in a person's determination. — Tommy Lasorda"
  ];

  // State for tracking the current quote
  const [currentQuote, setCurrentQuote] = useState(sportsQuotes[0]);
  const [fadeIn, setFadeIn] = useState(true);

  // Effect to rotate quotes
  useEffect(() => {
    const interval = setInterval(() => {
      // Start fade out
      setFadeIn(false);
      
      // After fade out, change quote and start fade in
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * sportsQuotes.length);
        setCurrentQuote(sportsQuotes[randomIndex]);
        setFadeIn(true);
      }, 500); // This should match the fade-out duration in CSS
      
    }, 4000); // Change quote every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900 z-50">
      {/* Pulsing logo */}
      <div className="relative w-32 h-32 mb-8 animate-pulse">
        {/* Replace with your logo */}
        <Image 
          src="/logo.png" 
          alt="Your Logo"
          width={128}
          height={128}
          className="object-contain"
          onError={(e) => {
            // Fallback if logo doesn't load
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 24 24' fill='none' stroke='%23000000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z'%3E%3C/path%3E%3Cpolyline points='3.27 6.96 12 12.01 20.73 6.96'%3E%3C/polyline%3E%3Cline x1='12' y1='22.08' x2='12' y2='12'%3E%3C/line%3E%3C/svg%3E";
          }}
        />
      </div>
      
      {/* Spinner */}
      <div className="mb-6">
        <div className="w-12 h-12 rounded-full border-4 border-gray-300 border-t-blue-600 animate-spin"></div>
      </div>
      
      {/* Quote text with fade effect */}
      <div className={`max-w-md text-center px-4 transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-lg text-gray-700 dark:text-gray-300 italic">{currentQuote}</p>
      </div>
    </div>
  );
}