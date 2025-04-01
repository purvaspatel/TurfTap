import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Footer from "@/components/user/footer";

// Configure fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", 
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", 
});

// Enhanced metadata for better SEO
export const metadata: Metadata = {
  title: {
    template: "%s | Turf Tap - Community Sports Exploration Platform",
    default: "Turf Tap - Find Local Sports Communities & Events",
  },
  description: "Discover local sports communities, events, and venues in your area with Turf Tap - the community-driven sports exploration platform connecting athletes and enthusiasts.",
  keywords: ["sports", "community sports", "local events", "sports exploration", "sports platform", "find sports", "join sports communities"],
  creator: "Turf Tap Team",
  publisher: "Turf Tap",
  category: "Sports & Recreation",
  openGraph: {
    title: "Turf Tap - Find Local Sports Communities & Events",
    description: "Connect with local sports communities, discover events, and find venues near you with Turf Tap's community-driven platform.",
    url: "https://turftap.vercel.app/",
    siteName: "Turf Tap",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://turftap.vercel.app/TurfTapLogo.png", 
        width: 1200,
        height: 630,
        alt: "Turf Tap - Community Sports Exploration Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Turf Tap - Find Local Sports Communities & Events",
    description: "Connect with local sports communities, discover events, and find venues near you.",
    images: ["https://turftap.vercel.app/TurfTapLogo.png"], 
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://turftap.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen flex-col`}
      >
        <main id="main-content" className="flex-grow">
          {children}
        </main>
        
        <Footer />
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SportsOrganization",
              "name": "Turf Tap",
              "url": "https://turftap.vercel.app/",
              "logo": "https://turftap.vercel.app/TurfTapLogo.png",
              "description": "Community-driven sports exploration platform to discover best turfs, grounds and sports communities",
            })
          }}
        />
      </body>
    </html>
  );
}