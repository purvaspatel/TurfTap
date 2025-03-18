"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, Camera, Upload, X, ChevronsUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { cloudinaryConfig } from '@/app/lib/cloudinary';

const sportCategories = [
  { label: "Football", value: "football" },
  { label: "Cricket", value: "cricket" },
  { label: "Basketball", value: "basketball" },
  { label: "Tennis", value: "tennis" },
  { label: "Volleyball", value: "volleyball" },
  { label: "Badminton", value: "badminton" },
  { label: "Hockey", value: "hockey" },
  { label: "Rugby", value: "rugby" },
  { label: "Baseball", value: "baseball" },
  { label: "Swimming", value: "swimming" },
  { label: "Athletics", value: "athletics" },
];

export default function CreateGroundPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [customCategory, setCustomCategory] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  
  // Check if using mobile device on component mount
  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: { address: "", city: "", state: "", lat: 0, lng: 0 },
    timings: "",
    isPaid: false,
    price: 0,
    images: [] as string[],
  });

  // Update formData.category whenever selectedCategories or customCategory changes
  useEffect(() => {
    const allCategories = [...selectedCategories];
    if (customCategory.trim()) {
      allCategories.push(customCategory.trim());
    }
    setFormData(prev => ({
      ...prev,
      category: allCategories.join(", ")
    }));
  }, [selectedCategories, customCategory]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLocationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, [name]: value },
    }));
  };

  const handleIsPaidChange = (value: string) => {
    setFormData({ ...formData, isPaid: value === "true" });
  };

  const handleCategorySelect = (value: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(value)) {
        return prev.filter(category => category !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  const removeCategory = (category: string) => {
    setSelectedCategories(prev => prev.filter(c => c !== category));
  };

  const handleCustomCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomCategory(e.target.value);
  };

  // Handle Cloudinary upload success
  const handleUploadSuccess = (result: any) => {
    // Get the secure URL from the upload result
    const imageUrl = result.info.secure_url;
    
    // Update form data with the new image URL
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, imageUrl]
    }));
    
    toast.success("Image uploaded successfully!");
  };

  // Handle Cloudinary upload error
  const handleUploadError = (error: any) => {
    toast.error(`Upload failed: ${error.message || "Unknown error"}`);
  };

  // Remove an image from the images array
  const removeImage = (urlToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(url => url !== urlToRemove)
    }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate that at least one image is uploaded
    if (formData.images.length === 0) {
      toast.error("Please upload at least one image of the ground");
      return;
    }

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
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-medium">New Ground</CardTitle>
          <CardDescription className="text-muted-foreground">
            Submit a request for a new playing field or venue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Title
              </Label>
              <Input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="rounded-lg h-10"
                placeholder="Enter ground name"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="rounded-lg min-h-24 resize-none"
                placeholder="Describe the ground and its facilities"
                required
              />
            </div>

            {/* Category - Multiple Select with Custom Option */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Categories
              </Label>
              <div className="space-y-2">
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={popoverOpen}
                      className="w-full justify-between h-10 rounded-lg"
                    >
                      Select categories
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search categories..." />
                      <CommandList>
                        <CommandEmpty>No category found.</CommandEmpty>
                        <CommandGroup>
                          {sportCategories.map((category) => (
                            <CommandItem
                              key={category.value}
                              value={category.value}
                              onSelect={() => handleCategorySelect(category.value)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedCategories.includes(category.value)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {category.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* Display selected categories */}
                {selectedCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedCategories.map((category) => {
                      const categoryLabel = sportCategories.find(c => c.value === category)?.label || category;
                      return (
                        <Badge key={category} variant="secondary" className="px-2 py-1">
                          {categoryLabel}
                          <X
                            className="ml-1 h-3 w-3 cursor-pointer"
                            onClick={() => removeCategory(category)}
                          />
                        </Badge>
                      );
                    })}
                  </div>
                )}

                {/* Custom category input */}
                <Input
                  type="text"
                  value={customCategory}
                  onChange={handleCustomCategoryChange}
                  className="rounded-lg h-10 mt-2"
                  placeholder="Add a custom category"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Location</Label>
              <div className="grid gap-3">
                <Input
                  type="text"
                  name="address"
                  value={formData.location.address}
                  onChange={handleLocationChange}
                  className="rounded-lg h-10"
                  placeholder="Address"
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="text"
                    name="city"
                    value={formData.location.city}
                    onChange={handleLocationChange}
                    className="rounded-lg h-10"
                    placeholder="City"
                    required
                  />
                  <Input
                    type="text"
                    name="state"
                    value={formData.location.state}
                    onChange={handleLocationChange}
                    className="rounded-lg h-10"
                    placeholder="State"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Timings */}
            <div className="space-y-2">
              <Label htmlFor="timings" className="text-sm font-medium">
                Available Hours
              </Label>
              <Input
                id="timings"
                type="text"
                name="timings"
                value={formData.timings}
                onChange={handleChange}
                className="rounded-lg h-10"
                placeholder="e.g. Mon-Fri 9 AM - 6 PM"
                required
              />
            </div>

            {/* Paid or Free */}
            <div className="space-y-2">
              <Label htmlFor="isPaid" className="text-sm font-medium">
                Pricing
              </Label>
              <Select onValueChange={handleIsPaidChange} defaultValue="false">
                <SelectTrigger className="rounded-lg h-10">
                  <SelectValue placeholder="Select pricing option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">Free to use</SelectItem>
                  <SelectItem value="true">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price (Only shows if Paid is selected) */}
            {formData.isPaid && (
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium">
                  Price (per hour)
                </Label>
                <Input
                  id="price"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="rounded-lg h-10"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            )}

            {/* Cloudinary Image Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Ground Images</Label>
              
              <div className="flex flex-col items-center">
                {/* Display uploaded images */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 w-full mb-4">
                    {formData.images.map((imageUrl, index) => (
                      <div key={index} className="relative rounded-lg overflow-hidden aspect-video">
                        <CldImage
                          width={300}
                          height={200}
                          src={imageUrl.split('/').pop()?.split('.')[0] || ''}
                          sizes="100vw"
                          alt={`Ground image ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 w-8 h-8 p-0 rounded-full"
                          onClick={() => removeImage(imageUrl)}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Cloudinary Upload Widget */}
                <CldUploadWidget
                  uploadPreset="sports_grounds"
                  onSuccess={handleUploadSuccess}
                  onError={handleUploadError}
                  options={{
                    maxFiles: 4,
                    sources: ['local', 'camera', 'url'],
                    resourceType: 'image',
                    clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
                    maxFileSize: 5000000, // 5MB
                  }}
                >
                  {({ open }) => (
                    <div className="flex gap-3">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => open()}
                        className="flex gap-2 items-center"
                      >
                        <Upload size={16} />
                        Upload Image
                      </Button>
                      
                      {isMobile && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => open('camera')}
                          className="flex gap-2 items-center"
                        >
                          <Camera size={16} />
                          Take Photo
                        </Button>
                      )}
                    </div>
                  )}
                </CldUploadWidget>
                
                {/* Upload requirements note */}
                <p className="text-xs text-muted-foreground mt-2">
                  Upload at least one image of the ground. Max 4 images, 5MB each.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full rounded-lg h-11 bg-black hover:bg-black/90 text-white transition-colors"
            >
              Submit Request
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}