"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function CreateGroundPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: { address: "", city: "", state: "", lat: 0, lng: 0 },
    timings: "",
    isPaid: false,
    price: 0,
    images: [""],
  });

  // ✅ Standard text input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Special handler for nested location object
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, [name]: value }, // Properly update nested object
    }));
  };

  // ✅ Fix for handling image URL updates
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      images: [e.target.value], // Ensure images array updates correctly
    }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/grounds/request", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Ground request submitted successfully!");
      router.push("/grounds");
    } else {
      toast.error(`${data.error || "Failed to submit request"}`);
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Submit a New Ground</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow-md rounded-lg">
        {/* Title */}
        <div>
          <Label>Title</Label>
          <Input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>

        {/* Description */}
        <div>
          <Label>Description</Label>
          <Textarea name="description" value={formData.description} onChange={handleChange} required />
        </div>

        {/* Category */}
        <div>
          <Label>Category</Label>
          <Input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="e.g., Football, Cricket" required />
        </div>

        {/* Location */}
        <div>
          <Label>Location</Label>
          <Input type="text" name="address" value={formData.location.address} onChange={handleLocationChange} placeholder="Address" required />
          <Input type="text" name="city" value={formData.location.city} onChange={handleLocationChange} placeholder="City" required />
          <Input type="text" name="state" value={formData.location.state} onChange={handleLocationChange} placeholder="State" required />
        </div>

        {/* Timings */}
        <div>
          <Label>Timings</Label>
          <Input type="text" name="timings" value={formData.timings} onChange={handleChange} required />
        </div>

        {/* Paid or Free */}
        <div>
          <Label>Paid or Free</Label>
          <select name="isPaid" onChange={(e) => setFormData({ ...formData, isPaid: e.target.value === "true" })} required>
            <option value="false">Free</option>
            <option value="true">Paid</option>
          </select>
        </div>

        {/* Price (Only shows if Paid is selected) */}
        {formData.isPaid && (
          <div>
            <Label>Price</Label>
            <Input type="number" name="price" value={formData.price} onChange={handleChange} required />
          </div>
        )}

        {/* Image Upload */}
        <div>
          <Label>Image URL</Label>
          <Input type="text" name="images" value={formData.images[0]} onChange={handleImageChange} required />
        </div>

        {/* Submit Button */}
        <Button type="submit">Submit Request</Button>
      </form>
    </div>
  );
}
