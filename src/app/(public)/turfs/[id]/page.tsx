"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
        submittedBy: { name: string };
        upvotes: number;
        downvotes: number;
        createdAt: string;
    }

    const { id } = useParams();
    const [ground, setGround] = useState<Ground | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchGround() {
            const res = await fetch(`/api/grounds/${id}`);
            if (res.ok) {
                const data = await res.json();
                setGround(data.ground);
            }
            setLoading(false);
        }
        fetchGround();
    }, [id]);

    if (loading) return <p className="text-center text-lg">Loading...</p>;
    if (!ground) return <p className="text-center text-lg">Ground not found</p>;

    return (
        <div className="container mx-auto max-w-4xl p-6">
            {/* Title & Tags */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">{ground.title}</h1>
                <div className="flex gap-2">
                    {ground.category.map((tag) => (
                        <Badge key={tag} variant="outline">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Image */}
            <div className="relative w-full h-96 my-6">
                <Image
                    src={ground.images[0] || "/placeholder.png"}
                    alt={ground.title}
                    fill
                    className="object-cover rounded-lg"
                />
            </div>

            {/* Description & Info */}
            <p className="text-gray-700 text-lg">{ground.description}</p>

            {/* Location (Google Maps Embed) */}
            {/* Location (Google Maps Embed) */}
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
                    <span className="font-semibold">Timings:</span> {ground.timings}
                </p>
                <p className="text-gray-700">
                    <span className="font-semibold">Price:</span>{" "}
                    {ground.isPaid ? `$${ground.price}` : "Free"}
                </p>
            </div>

            {/* Posted By */}
            <p className="mt-6 text-sm text-gray-500">
                Posted by <span className="font-medium">@{ground.submittedBy.name}</span> on{" "}
                {new Date(ground.createdAt).toLocaleDateString()}
            </p>

            {/* Dummy Votes */}
            <div className="mt-6 flex items-center gap-6 text-gray-600">
                <p>🔼 {ground.upvotes} Upvotes</p>
                <p>🔽 {ground.downvotes} Downvotes</p>
            </div>

            {/* Static Nested Comments Placeholder */}
            <div className="mt-10 p-4 border rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Comments (Coming Soon)</h3>
                <div className="space-y-4">
                    <div className="p-3 border rounded-lg">
                        <p className="font-medium">@User123</p>
                        <p className="text-gray-700">This is a great place to play!</p>
                    </div>
                    <div className="p-3 border rounded-lg ml-6">
                        <p className="font-medium">@User456</p>
                        <p className="text-gray-700">I totally agree! Well maintained ground.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
