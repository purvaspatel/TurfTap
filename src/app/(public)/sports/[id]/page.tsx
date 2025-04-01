"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Comments from "@/components/user/comments";
import LoadingSpinner from "@/components/isLoading";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

export default function TurfDetails() {
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
        submittedBy: { name: string; _id: string };
        upvotes: number;
        downvotes: number;
        createdAt: string;
    }

    const { id } = useParams();
    const { data: session, status } = useSession();
    const [ground, setGround] = useState<Ground | null>(null);
    const [loading, setLoading] = useState(true);
    const [userVote, setUserVote] = useState<"upvote" | "downvote" | null>(null);
    const [upvotes, setUpvotes] = useState(0);
    const [downvotes, setDownvotes] = useState(0);
    const [voteLoading, setVoteLoading] = useState(false);

    // Fetch ground details
    useEffect(() => {
        async function fetchGround() {
            const res = await fetch(`/api/grounds/${id}`);
            if (res.ok) {
                const data = await res.json();
                setGround(data.ground);
                setUpvotes(data.ground.upvotes);
                setDownvotes(data.ground.downvotes);
            }
            setLoading(false);
        }
        fetchGround();
    }, [id]);

    // Fetch user's vote (if logged in)
    useEffect(() => {
        async function fetchUserVote() {
            if (session && session.user) {
                const res = await fetch(`/api/grounds/vote?groundId=${id}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.vote) {
                        setUserVote(data.vote.voteType);
                    }
                }
            }
        }

        if (status === "authenticated") {
            fetchUserVote();
        }
    }, [id, session, status]);

    // Handle voting
    const handleVote = async (voteType: "upvote" | "downvote") => {
        if (!session || !session.user) {
            toast.error("Please sign in to vote");
            return;
        }

        // Prevent multiple rapid clicks
        if (voteLoading) return;

        setVoteLoading(true);

        try {
            const res = await fetch("/api/grounds/vote", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    groundId: id,
                    voteType,
                }),
            });

            if (!res.ok) throw new Error("Failed to vote");

            const data = await res.json();

            // Check which format the API returns and handle accordingly
            if (data.updatedGround) {
                // If API returns the full updated ground object
                setUpvotes(data.updatedGround.upvotes);
                setDownvotes(data.updatedGround.downvotes);
            } else if (data.ground) {
                // Alternative format
                setUpvotes(data.ground.upvotes);
                setDownvotes(data.ground.downvotes);
            } else {
                // If API doesn't return ground data, fetch the latest ground data
                const groundRes = await fetch(`/api/grounds/${id}`);
                if (groundRes.ok) {
                    const groundData = await groundRes.json();
                    setUpvotes(groundData.ground.upvotes);
                    setDownvotes(groundData.ground.downvotes);
                }
            }

            // Update user vote status
            if (data.userVote !== undefined) {
                setUserVote(data.userVote);
            } else if (voteType === userVote) {
                // If clicking the same button, toggle off
                setUserVote(null);
            } else {
                // Otherwise set to the new vote type
                setUserVote(voteType);
            }

        } catch (error) {
            console.error("Error voting:", error);
            toast.error("Failed to vote");
        } finally {
            setVoteLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (!ground) return <p className="text-center text-lg">Ground not found</p>;

    return (
        <div className="container mx-auto max-w-4xl p-6">
            {/* Title & Tags */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">{ground.title}</h1>
                <div className="flex gap-2 flex-wrap">
                    {ground.category.map((tag) => (
                        <Badge key={tag} variant="outline">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Image Carousel */}
            <div className="my-6">
                {ground.images && ground.images.length > 0 ? (
                    <Carousel className="w-full">
                        <CarouselContent>
                            {ground.images.map((image, index) => (
                                <CarouselItem key={index}>
                                    <div className="relative w-full h-96">
                                        <Image
                                            src={image || "/placeholder.png"}
                                            alt={`${ground.title} - Image ${index + 1}`}
                                            fill
                                            className="object-cover rounded-lg"
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-2" />
                        <CarouselNext className="right-2" />
                    </Carousel>
                ) : (
                    <div className="relative w-full h-96">
                        <Image
                            src="/placeholder.png"
                            alt={ground.title}
                            fill
                            className="object-cover rounded-lg"
                        />
                    </div>
                )}
            </div>

            {/* Description & Info */}
            <p className="text-gray-700 text-lg">{ground.description}</p>

            {/* Location (Google Maps Embed) */}
            <div className="mt-6">
                <h3 className="text-xl font-semibold">Location</h3>
                <p className="text-gray-600">
                    {ground.location.city}, {ground.location.state}
                </p>
                <iframe
                    src={ground.location?.address ?
                        ground.location.address.replace(/&amp;/g, '&').replace('http:', 'https:')
                        : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1679868994965!5m2!1sen!2s"}
                    className="w-full h-64 mt-3 rounded-lg"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>

            {/* Pricing & Timings */}
            <div className="mt-6">
                <h3 className="text-xl font-semibold">Details</h3>
                <p className="text-gray-700">
                    <span className="font-semibold">Timings (variable):</span> {ground.timings}
                </p>
                <p className="text-gray-700">
                    <span className="font-semibold">Price:</span>{" "}
                    {ground.isPaid ? `Can be variable (INR. Rs.) ${ground.price}` : "Free"}
                </p>
            </div>

            {/* Posted By */}
            <p className="mt-6 text-sm text-gray-500">
                Posted by <span className="font-medium">@{ground.submittedBy.name}</span> on{" "}
                {new Date(ground.createdAt).toLocaleDateString()}
            </p>

            {/* Dynamic Voting Section */}
            <div className="mt-6 flex items-center gap-6">
                <button
                    onClick={() => handleVote("upvote")}
                    className={`flex bg-gray-50 p-2 border-1 rounded-[2] items-center gap-2 ${userVote === "upvote" ? "text-green-600 font-bold" : "text-gray-600"}`}
                    aria-label="Upvote"
                    disabled={loading}
                >
                    <ArrowBigUp className={userVote === "upvote" ? "fill-green-600" : ""} />
                    <span>{upvotes} Upvotes</span>
                </button>
                <button
                    onClick={() => handleVote("downvote")}
                    className={`flex bg-gray-50 p-2 border-1 rounded-[2]  items-center gap-2 ${userVote === "downvote" ? "text-red-600 font-bold" : "text-gray-600"}`}
                    aria-label="Downvote"
                    disabled={loading}
                >
                    <ArrowBigDown className={userVote === "downvote" ? "fill-red-600" : ""} />
                    <span>{downvotes} Downvotes</span>
                </button>
            </div>

            {/* Comments component */}
            {ground._id && <Comments groundId={ground._id} />}
        </div>
    );
}