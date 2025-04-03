import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { Ground } from "@/app/models/Ground";

// Set this to your production domain
const BASE_URL = "https://turftap.vercel.app"; // Replace with your actual domain

export async function GET() {
  try {
    await connectDB();
    
    // Get all approved grounds for dynamic URLs
    const grounds = await Ground.find({ status: "approved" });

    // Static URLs with priority levels
    const staticUrls = [
      { loc: `${BASE_URL}/`, priority: "1.0" }, // Highest priority for the main page
      { loc: `${BASE_URL}/sports`, priority: "0.9" },
      { loc: `${BASE_URL}/explore/football`, priority: "0.8" },
      { loc: `${BASE_URL}/explore/cricket`, priority: "0.8" },
      { loc: `${BASE_URL}/explore/pickleball`, priority: "0.8" },
      { loc: `${BASE_URL}/city/ahmedabad`, priority: "0.7" },
      { loc: `${BASE_URL}/vision`, priority: "0.6" },
      { loc: `${BASE_URL}/top-contributors`, priority: "0.6" },
      { loc: `${BASE_URL}/help`, priority: "0.6" },
      { loc: `${BASE_URL}/createdby`, priority: "0.6" },
      { loc: `${BASE_URL}/grounds/create`, priority: "0.5" },
    ];

    // Generate dynamic URLs for all grounds with default priority
    const dynamicUrls = grounds.map(ground => ({
      loc: `${BASE_URL}/grounds/${ground._id}`,
      priority: "0.8",
    }));

    // Combine all URLs
    const allUrls = [...staticUrls, ...dynamicUrls];

    // Generate the sitemap XML content
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${allUrls.map(({ loc, priority }) => `
        <url>
          <loc>${loc}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>daily</changefreq>
          <priority>${priority}</priority>
        </url>
      `).join("")}
    </urlset>`;

    // Return the sitemap XML with appropriate headers
    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return NextResponse.json(
      { error: "Failed to generate sitemap" },
      { status: 500 }
    );
  }
}
