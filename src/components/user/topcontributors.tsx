"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Medal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface User {
  _id: string;
  name: string;
  profileImage: string | null;
  turftapPoints: number;
}

interface TopContributorsProps {
  limit?: number;
}

export default function TopContributors({ limit = 10 }: TopContributorsProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch top contributors
  useEffect(() => {
    const fetchContributors = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/users/top-contributors?page=${page}&limit=${limit}`);
        
        if (!res.ok) {
          throw new Error("Failed to fetch contributors");
        }
        
        const data = await res.json();
        setUsers(data.users);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching top contributors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();
  }, [page, limit]);

  // Handle pagination
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  // Get medal color based on index
  const getMedalColor = (index: number) => {
    if (index === 0) return "text-yellow-500"; // Gold
    if (index === 1) return "text-gray-400"; // Silver
    if (index === 2) return "text-amber-700"; // Bronze
    return "text-gray-300"; // Default
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">Top Contributors</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        
        {error && (
          <div className="text-center py-8 text-red-500">
            {error}
          </div>
        )}
        
        {!loading && !error && users.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No contributors found.
          </div>
        )}
        
        {!loading && !error && users.length > 0 && (
          <>
            <div className="space-y-4">
              {users.map((user, index) => (
                <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className={`absolute -top-1 -left-1 ${getMedalColor(index + (page - 1) * limit)}`}>
                        <Medal size={16} />
                      </div>
                      <div className="relative h-10 w-10 rounded-full overflow-hidden border border-gray-200">
                        {user.profileImage ? (
                          <Image 
                            src={user.profileImage} 
                            alt={user.name}
                            width={40}
                            height={40}
                            className="object-cover"
                            // Add a cache-busting parameter to force image refresh when needed
                            key={`${user._id}-${new Date().getTime()}`}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-600 font-semibold">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">
                        Rank: <span className="font-semibold">#{index + 1 + (page - 1) * limit}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">{user.turftapPoints}</span>
                    <span className="text-sm text-gray-500">points</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handlePrevPage} 
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleNextPage} 
                  disabled={page === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}