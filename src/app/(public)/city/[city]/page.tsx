"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function SportsCityPage() {
  interface Ground {
    _id: string;
    title: string;
    images: string[];
    submittedBy: { name: string };
    category: string[];
    upvotes: number;
  }

  const { city } = useParams(); // Get dynamic sport & city from URL
  console.log('city :',city);
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  
  useEffect(() => {
    async function fetchGrounds() {
      const res = await fetch(`/api/grounds?city=${city}&sort=upvotes&page=${page}`);
      if (res.ok) {
        const data = await res.json();
        setGrounds(data.grounds);
        setTotalPages(data.totalPages);
      }
      setLoading(false);
    }
    fetchGrounds();
  }, [city, page]);

  if (loading) return <p className="text-center text-lg">Loading grounds...</p>;

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <h1 className="text-3xl font-bold mb-6">Best places to play in {city}</h1>

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

              {/* Upvotes */}
              <p className="text-sm text-gray-600 mt-2">{ground.upvotes} Upvotes</p>

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
          onClick={() => router.push(`/sports/${city}?page=${page - 1}`)}
        >
          ← Previous
        </Button>
        <span className="text-gray-700 text-sm">Page {page} of {totalPages}</span>
        <Button
          variant="outline"
          disabled={page >= totalPages}
          onClick={() => router.push(`/sports/${city}?page=${page + 1}`)}
        >
          Next →
        </Button>
      </div>
    </div>
  );
}
