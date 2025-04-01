"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Award } from "lucide-react";
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
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Set initial state
    handleResize();
    
    // Add event listener
    window.addEventListener("resize", handleResize);
    
    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // Get award color and title based on rank
  const getAwardInfo = (rank: number) => {
    if (rank === 1) return { color: "text-yellow-500", title: "Gold" }; // Gold
    if (rank === 2) return { color: "text-gray-400", title: "Silver" }; // Silver
    if (rank === 3) return { color: "text-amber-700", title: "Bronze" }; // Bronze
    return { color: "", title: "" }; // No award
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-xl sm:text-2xl font-bold">Top Contributors</CardTitle>
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
            <div className="space-y-3">
              {users.map((user, index) => {
                const rank = index + 1 + (page - 1) * limit;
                const { color, title } = getAwardInfo(rank);
                const showAward = rank <= 3;
                
                return (
                  <div 
                    key={user._id} 
                    className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full overflow-hidden border border-gray-200">
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
                            <span className="text-gray-600 font-semibold text-xs sm:text-base">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center">
                        <div>
                          <p className="font-medium text-sm sm:text-base truncate max-w-32 sm:max-w-full">
                            {user.name}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            Rank: <span className="font-semibold">#{rank}</span>
                          </p>
                        </div>
                        {showAward && (
                          <div className={`ml-1 sm:ml-2 ${color}`} title={`${title} award`}>
                            <Award size={isMobile ? 14 : 18} />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="text-base sm:text-lg font-bold">{user.turftapPoints}</span>
                      <span className="text-xs sm:text-sm text-gray-500">points</span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-3">
              <div className="text-xs sm:text-sm text-gray-500 order-2 sm:order-1">
                Page {page} of {totalPages}
              </div>
              <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-start order-1 sm:order-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handlePrevPage} 
                  disabled={page === 1}
                  className="text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-3 h-8"
                >
                  <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  {isMobile ? "Prev" : "Previous"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleNextPage} 
                  disabled={page === totalPages}
                  className="text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-3 h-8"
                >
                  Next
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}