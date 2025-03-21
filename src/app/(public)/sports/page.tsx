"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SubBar from "@/components/user/subbar";

export default function TurfHome() {
  interface Ground {
    _id: string;
    title: string;
    images: string[];
    submittedBy: { name: string };
    category: string[];
    city?: string;
    state?: string;
  }

  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const sport = searchParams.get("sport") || "all";
  const city = searchParams.get("city") || "all";
  const state = searchParams.get("state") || "all";
  const sort = searchParams.get("sort") || "top";

  useEffect(() => {
    async function fetchGrounds() {
      // Build API URL with all filters
      let apiUrl = `/api/grounds?page=${page}&sort=${sort}`;
      if (sport !== "all") apiUrl += `&sport=${sport}`;
      if (city !== "all") apiUrl += `&city=${city}`;
      if (state !== "all") apiUrl += `&state=${state}`;
      
      setLoading(true);
      const res = await fetch(apiUrl);
  
      if (res.ok) {
        const data = await res.json();
        setGrounds(data.grounds);
        setTotalPages(data.totalPages);
      }
      setLoading(false);
    }
    fetchGrounds();
  }, [page, sport, city, state, sort]);

  // Generate URL for pagination that preserves all filters
  const getPaginationUrl = (pageNum: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNum.toString());
    return `/sports?${params.toString()}`;
  };

  if (loading) return (
    <>
      
      <div className="container mx-auto max-w-6xl p-6">
        <p className="text-center text-lg">Loading turfs...</p>
      </div>
    </>
  );

  return (
    <>
      <SubBar/>
      <div className="container mx-auto max-w-6xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Explore Nearby Turfs & Grounds</h1>
          
          {/* Filter summary */}
          <div className="text-sm text-gray-600">
            {sport !== "all" && <span className="font-medium">{sport.charAt(0).toUpperCase() + sport.slice(1)} </span>}
            {city !== "all" && <span>in {city.charAt(0).toUpperCase() + city.slice(1)} </span>}
            {state !== "all" && <span>({state.charAt(0).toUpperCase() + state.slice(1)})</span>}
          </div>
        </div>

        {grounds.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-gray-700">No turfs found with these filters</h2>
            <p className="text-gray-500 mt-2">Try changing your filter criteria</p>
          </div>
        ) : (
          <>
            {/* Grid Layout for Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {grounds.map((ground) => (
                <div key={ground._id} className="bg-white shadow-md overflow-hidden border">
                  {/* Image */}
                  <div className="relative h-52">
                    <Image
                      src={ground.images[0] || "/placeholder.png"}
                      alt={ground.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h2 className="text-lg font-semibold line-clamp-1">{ground.title}</h2>

                    {/* Posted By */}
                    <p className="text-sm text-gray-600">
                      Posted by <span className="font-medium">@{ground.submittedBy.name}</span>
                    </p>

                    {/* Tags */}
                    <div className="mt-2 flex flex-wrap gap-2">
                      {ground.category.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Location info if available */}
                    {(ground.city || ground.state) && (
                      <p className="text-xs text-gray-500 mt-2">
                        {ground.city && <span>{ground.city}, </span>}
                        {ground.state && <span>{ground.state}</span>}
                      </p>
                    )}

                    {/* View Details Button */}
                    <div className="mt-3">
                      <Link href={`/sports/${ground._id}`}>
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-between">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => router.push(getPaginationUrl(page - 1))}
              >
                ← Previous
              </Button>
              <span className="text-gray-700 text-sm">Page {page} of {totalPages}</span>
              <Button
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => router.push(getPaginationUrl(page + 1))}
              >
                Next →
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}