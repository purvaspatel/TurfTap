"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { 
  Heart, 
  HeartOff,
  MessageCircle,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Tag,
  DollarSign,
  Calendar,
  Clock,
  User
} from "lucide-react";

export default function GroundsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  interface Ground {
    _id: string;
    title: string;
    description: string;
    category: string[];
    location: {
      address: string;
      state: string;
      city: string;
      lat: number;
      lng: number;
    };
    timings: string;
    isPaid: boolean;
    price?: number;
    images: string[];
    submittedBy: {
      _id: string;
      name: string;
      profileImage: string;
    };
    status: "pending" | "approved" | "rejected";
    remarks?: string;
    upvotes: number;
    downvotes: number;
    createdAt: Date;
    userVote?: "upvote" | "downvote" | null;
    commentCount?: number;
  }

  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"hot" | "new" | "top">("hot");
  const [userVotes, setUserVotes] = useState<Record<string, "upvote" | "downvote">>({});
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({});

  useEffect(() => {
    async function fetchGrounds() {
      try {
        const res = await fetch(`/api/grounds?sort=${sortBy}&status=approved`);
        if (res.ok) {
          const data = await res.json();
          setGrounds(data.grounds);
          
          // Initialize current image index for each ground
          const imageIndices: Record<string, number> = {};
          data.grounds.forEach((ground: Ground) => {
            imageIndices[ground._id] = 0;
          });
          setCurrentImageIndex(imageIndices);
        }
      } catch (error) {
        console.error("Failed to fetch grounds:", error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchUserVotes() {
      if (session?.user) {
        try {
          const res = await fetch(`/api/grounds/vote`);
          if (res.ok) {
            const data = await res.json();
            const votesMap: Record<string, "upvote" | "downvote"> = {};
            
            data.votes.forEach((vote: any) => {
              votesMap[vote.groundId] = vote.voteType;
            });
            
            setUserVotes(votesMap);
          }
        } catch (error) {
          console.error("Failed to fetch user votes:", error);
        }
      }
    }

    fetchGrounds();
    fetchUserVotes();
  }, [sortBy, session?.user]);

  // Combine grounds with user votes
  const groundsWithUserVotes = grounds.map(ground => ({
    ...ground,
    userVote: userVotes[ground._id]
  }));

  async function handleVote(groundId: string, voteType: "upvote" | "downvote") {
    if (!session) {
      router.push("/signin"); // Require login
      return;
    }

    const currentGround = grounds.find(g => g._id === groundId);
    const userCurrentVote = userVotes[groundId];
    
    // Optimistic UI update
    const updatedGrounds = grounds.map((g) => {
      if (g._id !== groundId) return g;
      
      let upvoteDelta = 0;
      let downvoteDelta = 0;
      let newUserVote: "upvote" | "downvote" | null = voteType;
      
      // If clicking the same vote type they already did - remove the vote
      if (userCurrentVote === voteType) {
        newUserVote = null;
        if (voteType === "upvote") upvoteDelta = -1;
        else downvoteDelta = -1;
      }
      // If switching votes
      else if (userCurrentVote) {
        if (voteType === "upvote") {
          upvoteDelta = 1;
          downvoteDelta = -1;
        } else {
          upvoteDelta = -1;
          downvoteDelta = 1;
        }
      }
      // First time voting
      else {
        if (voteType === "upvote") upvoteDelta = 1;
        else downvoteDelta = 1;
      }
      
      return {
        ...g,
        upvotes: g.upvotes + upvoteDelta,
        downvotes: g.downvotes + downvoteDelta
      };
    });
    
    setGrounds(updatedGrounds);
    
    // Update user votes tracking
    const newUserVotes = {...userVotes};
    if (userCurrentVote === voteType) {
      delete newUserVotes[groundId];
    } else {
      newUserVotes[groundId] = voteType;
    }
    setUserVotes(newUserVotes);

    // API call
    try {
      const res = await fetch("/api/grounds/vote", {
        method: "POST",
        body: JSON.stringify({ groundId, voteType }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        // Revert optimistic update if API call fails
        setGrounds(grounds);
        setUserVotes(userVotes);
      }
    } catch (error) {
      console.error("Vote API error:", error);
      // Revert optimistic update
      setGrounds(grounds);
      setUserVotes(userVotes);
    }
  }

  const handleImageNavigation = (groundId: string, direction: 'next' | 'prev') => {
    const ground = grounds.find(g => g._id === groundId);
    if (!ground) return;
    
    const imageCount = ground.images.length;
    const currentIdx = currentImageIndex[groundId];
    
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIdx + 1) % imageCount;
    } else {
      newIndex = (currentIdx - 1 + imageCount) % imageCount;
    }
    
    setCurrentImageIndex({
      ...currentImageIndex,
      [groundId]: newIndex
    });
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-300"></div>
    </div>
  );

  return (
    <div className="container mx-auto max-w-lg p-4">
      <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">Grounds & Turfs</h1>

      <div className="space-y-8">
        {grounds.map((ground) => (
          <div key={ground._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            {/* Header with user info and title */}
            <div className="flex items-center p-4">
              <Image
                src={ground.submittedBy.profileImage || "/default-user.png"}
                alt={ground.submittedBy.name}
                width={36}
                height={36}
                className="rounded-full w-9 h-9 object-cover ring-2 ring-gray-100"
              />
              <div className="ml-3">
                <p className="font-medium text-sm">@{ground.submittedBy.name}</p>
                <p className="text-xs text-gray-500">{ground.location.city}, {ground.location.state}</p>
              </div>
            </div>

            {/* Post title */}
            <div className="px-4 pb-2">
              <h2 className="text-xl font-semibold text-gray-800">{ground.title}</h2>
            </div>

            {/* Image carousel */}
            {ground.images && ground.images.length > 0 && (
              <div className="relative w-full h-96">
                <Image
                  src={ground.images[currentImageIndex[ground._id]]}
                  alt={ground.title}
                  fill
                  className="object-cover"
                />
                
                {ground.images.length > 1 && (
                  <>
                    <button 
                      onClick={() => handleImageNavigation(ground._id, 'prev')} 
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-1 backdrop-blur-sm"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleImageNavigation(ground._id, 'next')} 
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-1 backdrop-blur-sm"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    
                    {/* Image pagination dots */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
                      {ground.images.map((_, idx) => (
                        <div 
                          key={idx} 
                          className={`w-1.5 h-1.5 rounded-full ${idx === currentImageIndex[ground._id] ? 'bg-white' : 'bg-white/50'}`}
                        ></div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  className="p-1 hover:bg-transparent"
                  onClick={() => handleVote(ground._id, "upvote")}
                >
                  <Heart className={`w-6 h-6 ${ground.userVote === "upvote" ? "fill-red-500 text-red-500" : "text-gray-700"}`} />
                </Button>
                <span className="text-sm font-medium">{ground.upvotes - ground.downvotes}</span>
                <Button
                  variant="ghost"
                  className="p-1 hover:bg-transparent"
                  onClick={() => handleVote(ground._id, "downvote")}
                >
                  <HeartOff className={`w-6 h-6 ${ground.userVote === "downvote" ? "text-blue-500" : "text-gray-700"}`} />
                </Button>
                <Link href={`/grounds/${ground._id}`} className="flex items-center text-gray-700">
                  <MessageCircle className="w-6 h-6 mr-1" />
                  <span className="text-sm">{ground.commentCount || 0}</span>
                </Link>
              </div>
            </div>

            {/* Quick details */}
            <div className="px-4 pb-4">
              <div className="text-gray-600 text-sm space-y-1.5">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{ground.location.address}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{ground.timings}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{ground.isPaid ? `$${ground.price}` : 'Free'}</span>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="px-4 pb-4 flex flex-wrap gap-1.5">
              {ground.category.map((cat) => (
                <Badge key={cat} variant="outline" className="text-xs bg-gray-50 text-gray-600 rounded-full py-0.5 px-2 hover:bg-gray-100">
                  {cat}
                </Badge>
              ))}
            </div>

            {/* View details button */}
            <div className="px-4 pb-4">
              <Link href={`/grounds/${ground._id}`}>
                <Button 
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full" 
                  variant="ghost"
                >
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {grounds.length === 0 && (
        <div className="text-center p-10 bg-white rounded-xl border">
          <p className="text-gray-500">No grounds found. Be the first to create one!</p>
          <Button className="mt-4 rounded-full bg-black text-white hover:bg-gray-800" onClick={() => router.push("/grounds/new")}>
            Create Ground Post
          </Button>
        </div>
      )}
    </div>
  );
}