import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Footer from "@/components/user/footer";
import Head from "next/head";
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
  keywords: [
    "pickleball in ahmedabad",
    "football turf near me",
    "pickleball court",
    "best pickleball court in ahmedabad",
    "sports",
    "community sports",
    "local events",
    "sports exploration",
    "sports platform",
    "find sports",
    "join sports communities",
    "cricket in ahmedabad",
    "football in ahmedabad",
    "best football ground in ahmedabad",
    "top cricket ground in ahmedabad",
    "where to play pickleball",
    "nearest cricket turf",
    "nearest football turf",
    "football ground booking",
    "cricket turf booking",
    "pickleball tournament near me",
    "sports grounds in ahmedabad",
    "play football near me",
    "play cricket near me",
    "play pickleball near me",
    "rent football ground",
    "rent cricket ground",
    "rent pickleball court",
    "sports clubs in ahmedabad",
    "sports activities in ahmedabad",
    "local sports events",
    "find teammates for football",
    "find teammates for cricket",
    "find teammates for pickleball",
    "best turf in ahmedabad",
    "affordable sports grounds",
    "cheap football turf booking",
    "cheap cricket turf booking",
    "cheap pickleball courts",
    "book sports ground online",
    "book football turf online",
    "book cricket turf online",
    "book pickleball court online",
    "where to play football in ahmedabad",
    "where to play cricket in ahmedabad",
    "where to play pickleball in ahmedabad",
    "football ground near me",
    "cricket ground near me",
    "pickleball ground near me",
    "best places to play football",
    "best places to play cricket",
    "best places to play pickleball",
    "football ground availability",
    "cricket turf availability",
    "pickleball court availability",
    "Ahmedabad football booking",
    "Ahmedabad cricket booking",
    "Ahmedabad pickleball booking",
    "top rated football turf",
    "top rated cricket turf",
    "top rated pickleball court",
    "sports ground listing platform",
    "outdoor sports activities",
    "indoor football turf",
    "indoor cricket turf",
    "indoor pickleball court",
    "outdoor football ground",
    "outdoor cricket ground",
    "outdoor pickleball ground",
    "best turf for football",
    "best turf for cricket",
    "best court for pickleball",
    "cheap sports ground booking",
    "local sports meetups",
    "sports networking platform",
    "social sports booking",
    "book sports matches",
    "last minute sports booking",
    "instant turf booking",
    "quick football ground booking",
    "quick cricket ground booking",
    "quick pickleball ground booking",
    "play football today",
    "play cricket today",
    "play pickleball today",
    "top Ahmedabad sports venues",
    "turft booking app",
    "turf booking website",
    "Ahmedabad sports guide",
    "Ahmedabad sports enthusiasts",
    "Ahmedabad sports community",
    "Ahmedabad football league",
    "Ahmedabad cricket league",
    "Ahmedabad pickleball league",
    "best weekend sports activities",
    "sports fun in Ahmedabad",
    "top sports locations in Ahmedabad",
    "football near me today",
    "cricket near me today",
    "pickleball near me today",
    "sports ground rental",
    "turf rentals Ahmedabad",
    "top-rated football venues",
    "top-rated cricket venues",
    "top-rated pickleball venues",
    "affordable sports venues",
    "discounted turf bookings",
    "Ahmedabad weekend sports",
    "Ahmedabad sports meetup",
    "football ahmedabad",
    "cricket ahmedabad",
    "pickleball ahmedabad",
    "turftap Ahmedabad",
    "turftap sports booking",
    "turftap football",
    "turftap cricket",
    "turftap pickleball",
    "sports arena near me",
    "Ahmedabad sports lovers",
    "football groups in Ahmedabad",
    "cricket groups in Ahmedabad",
    "pickleball groups in Ahmedabad",
    "football teams in Ahmedabad",
    "cricket teams in Ahmedabad",
    "pickleball teams in Ahmedabad",
    "Ahmedabad football clubs",
    "Ahmedabad cricket clubs",
    "Ahmedabad pickleball clubs",
    "play sports and meet people",
    "social football events",
    "social cricket matches",
    "social pickleball matches",
    "best sports grounds Ahmedabad",
    "turftap booking",
    "turf tap sports"
  ],
  creator: "Purva Patel",
  publisher: "Purva Patel",
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
      <Head>
        <meta name="google-site-verification" content="OlCBXN1AhSOlPfytynFjCcPiqB6TEHeOKdM4d1c84NY" />

      </Head>
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