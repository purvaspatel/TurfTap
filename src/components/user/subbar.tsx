"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";

// Predefined sports categories
const sportsList = ["All", "Football", "Cricket", "Basketball", "Tennis", "Hockey", "Badminton"];

export default function SubBar() {
    const router = useRouter();
    const [locations, setLocations] = useState<{ city: string; state: string }[]>([]);
    const [selectedSport, setSelectedSport] = useState<string>("All");
    const [selectedLocation, setSelectedLocation] = useState<string>("All Locations");

    // Fetch unique locations from the API
    useEffect(() => {
        async function fetchLocations() {
            const res = await fetch("/api/locations");
            if (res.ok) {
                const data = await res.json();
                setLocations(data.locations);
            }
        }
        fetchLocations();
    }, []);

    // Handle Sport Selection
    const handleSportChange = (sport: string) => {
        setSelectedSport(sport);

        // If switching to "All", reset the location filter as well
        if (sport === "All") {
            setSelectedLocation("All Locations");
            router.push("/sports");
        }
    };
    
    // Handle Location Selection
    const handleLocationChange = (value: string) => {
        setSelectedLocation(value);

        // If "All Locations" is selected, reset the sport filter as well
        if (value === "All Locations" && selectedSport === "All") {
            router.push("/sports");
        }
    };

    // Handle Apply Button Click
    const handleRedirect = () => {
        if (selectedSport === "All" && selectedLocation === "All Locations") {
            router.push("/sports");
        } else if (selectedSport !== "All" && selectedLocation === "All Locations") {
            router.push(`/${selectedSport.toLowerCase()}`);
        } else if (selectedSport !== "All" && selectedLocation !== "All Locations") {
            const city = selectedLocation.split(",")[0].trim();
            router.push(`/${selectedSport.toLowerCase()}/${city.toLowerCase()}`);
        }else if (selectedSport == "All" && selectedLocation !== "All Locations") {
            const city = selectedLocation.split(",")[0].trim();
            router.push(`/city/${city.toLowerCase()}`);
        }
    };

    return (
        <div className="bg-green-500 shadow-sm px-4 py-2 flex justify-center items-center">
            <div className="flex items-center gap-3 w-full max-w-4xl">
                {/* Sports Slider */}
                <ScrollArea className="w-full max-w-xl">
                    <div className="flex justify-center space-x-2">
                        {sportsList.map((sport) => (
                            <Button
                                key={sport}
                                variant="ghost"
                                onClick={() => handleSportChange(sport)}
                                className={`px-3 py-1 h-8 text-sm rounded-full ${
                                    selectedSport === sport
                                        ? "bg-white text-green-700 hover:bg-white"
                                        : "text-white hover:bg-green-600 hover:text-white"
                                }`}
                            >
                                {sport}
                            </Button>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" className="h-1" />
                </ScrollArea>
    
                {/* Location Dropdown */}
                <Select onValueChange={handleLocationChange}>
                    <SelectTrigger className="w-40 h-8 border-0 bg-green-600 text-white text-sm rounded-full focus:ring-1 focus:ring-white focus:ring-offset-0">
                        <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            <SelectValue placeholder={selectedLocation} />
                        </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border-gray-200">
                        <SelectItem value="All Locations">All Locations</SelectItem>
                        {locations.map(({ city, state }) => (
                            <SelectItem key={city} value={`${city}, ${state}`}>
                                {city}, {state}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
    
                {/* Apply Filter Button */}
                <Button
                    onClick={handleRedirect}
                    className="h-8 px-4 py-1 bg-white text-green-700 hover:bg-green-50 rounded-full text-sm"
                >
                    Apply
                </Button>
            </div>
        </div>
    );
}