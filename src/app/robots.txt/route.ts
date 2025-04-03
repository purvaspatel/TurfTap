import { NextResponse } from "next/server";

export async function GET() {
    const robots = `User-agent: *
Allow: /$
Allow: /explore/
Allow: /sports/
Allow: /city/
Allow: /grounds/
Allow: /top-contributors/
Allow: /vision/
Allow: /createdby/
Allow: /grounds/create/

Disallow: /admin
Disallow: /dashboard
Disallow: /private
Disallow: /api/

Sitemap: https://turftap.vercel.app/sitemap.xml`;

    return new NextResponse(robots, {
        headers: {
            "Content-Type": "text/plain",
        },
    });
}
