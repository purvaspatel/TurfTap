import { NextResponse } from "next/server";

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Define static and dynamic URLs
  const staticUrls = [
    { loc: "/", lastmod: new Date().toISOString() },
    { loc: "/sports", lastmod: new Date().toISOString() },
    { loc: "/contact", lastmod: new Date().toISOString() },
  ];

  // Example: Fetch dynamic sports grounds from an API or database
  const dynamicUrls = [
    { loc: "/sports/football/ahmedabad", lastmod: new Date().toISOString() },
    { loc: "/sports/cricket/mumbai", lastmod: new Date().toISOString() },
  ];

  // Generate XML structure
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${[...staticUrls, ...dynamicUrls]
        .map(
          (url) => `<url>
            <loc>${siteUrl}${url.loc}</loc>
            <lastmod>${url.lastmod}</lastmod>
          </url>`
        )
        .join("")}
    </urlset>`;

  return new NextResponse(sitemap, {
    headers: { "Content-Type": "application/xml" },
  });
}
