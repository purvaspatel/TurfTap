"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { use } from "react";
import { CldImage } from "next-cloudinary";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react"; // Import X icon for delete button

// Define the ground type with all necessary properties
type Ground = {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: {
    address: string;
    city: string;
    state: string;
    lat: number;
    lng: number;
  };
  timings: string;
  isPaid: boolean;
  price: number;
  images: string[];
  status: string;
  createdAt: string;
};

export default function ReviewGround({ params }: { params: Promise<{ id: string }> }) {
  // Properly unwrap the params using React.use()
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  
  const router = useRouter();
  const [ground, setGround] = useState<Ground | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [updatedGround, setUpdatedGround] = useState<Partial<Ground>>({});
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function fetchGround() {
      try {
        const res = await fetch(`/api/grounds/${id}`);
        if (res.ok) {
          const data = await res.json();
          setGround(data.ground);
          setUpdatedGround(data.ground);
        } else {
          const errorText = await res.text();
          console.error("Error response:", errorText);
          toast.error("Failed to load ground data");
        }
      } catch (error) {
        console.error("Error fetching ground:", error);
        toast.error("An error occurred while loading ground data");
      } finally {
        setLoading(false);
      }
    }
    
    fetchGround();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUpdatedGround({ ...updatedGround, [name]: value });
  };

  const handleLocationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setUpdatedGround(prev => ({
      ...prev,
      location: {
        address: "",
        city: "",
        state: "",
        lat: 0,
        lng: 0,
        ...(prev.location || ground?.location),
        [name]: value,
      },
    }));
  };

  const handleIsPaidChange = (value: string) => {
    setUpdatedGround({ ...updatedGround, isPaid: value === "true" });
  };

  const handleDeleteImage = (index: number) => {
    if (!ground || !updatedGround.images) return;
    
    const updatedImages = [...updatedGround.images];
    updatedImages.splice(index, 1);
    
    setUpdatedGround({ 
      ...updatedGround, 
      images: updatedImages 
    });
    
    toast.info("Image marked for deletion. Save changes to confirm.");
  };

  async function handleSaveChanges() {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/grounds/${id}`, {
        method: "PUT",
        body: JSON.stringify(updatedGround),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const updatedData = await res.json();
        setGround(updatedData.ground || updatedGround as Ground);
        setEditMode(false);
        toast.success("Ground details updated successfully!");
      } else {
        let errorMessage = "Unknown error";
        try {
          const error = await res.json();
          errorMessage = error.message || errorMessage;
        } catch (e) {
          // If JSON parsing fails, use status text
          errorMessage = res.statusText || errorMessage;
        }
        toast.error(`Failed to update: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error updating ground:", error);
      toast.error("An error occurred while updating ground data");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleAction(action: "approve" | "reject") {
    setActionLoading(true);
    try {
      const res = await fetch(`/admin/api/grounds/${action}`, {
        method: "POST",
        body: JSON.stringify({ id: ground?._id }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        // Try to parse response, but don't fail if it's empty
        try {
          await res.json();
        } catch (e) {
          // Empty response is acceptable
        }
        
        toast.success(`Ground ${action === "approve" ? "approved" : "rejected"} successfully!`);
        router.push("/admin");
      } else {
        let errorMessage = "Unknown error";
        try {
          const error = await res.json();
          errorMessage = error.message || errorMessage;
        } catch (e) {
          // If JSON parsing fails, use status text
          errorMessage = res.statusText || errorMessage;
        }
        toast.error(`Failed to ${action}: ${errorMessage}`);
      }
    } catch (error) {
      console.error(`Error ${action}ing ground:`, error);
      toast.error(`An error occurred while ${action}ing the ground`);
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading ground data...</p>
        </div>
      </div>
    );
  }

  if (!ground) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-red-500">Ground Not Found</h1>
        <p className="mt-2 text-muted-foreground">The requested ground could not be found or has been deleted.</p>
        <Button 
          className="mt-4" 
          onClick={() => router.push("/admin")}
        >
          Return to Admin Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Review Ground</h1>
        <div className="flex gap-2">
          {!editMode ? (
            <Button onClick={() => setEditMode(true)} variant="outline">
              Edit Details
            </Button>
          ) : (
            <Button onClick={() => setEditMode(false)} variant="outline">
              Cancel
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Ground Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                {editMode ? (
                  <Input 
                    id="title" 
                    name="title" 
                    value={updatedGround.title || ''} 
                    onChange={handleInputChange} 
                  />
                ) : (
                  <div className="p-2 bg-muted rounded-md">{ground.title}</div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                {editMode ? (
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={updatedGround.description || ''} 
                    onChange={handleInputChange} 
                    rows={4}
                  />
                ) : (
                  <div className="p-2 bg-muted rounded-md min-h-[100px] whitespace-pre-wrap">
                    {ground.description}
                  </div>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Categories</Label>
                {editMode ? (
                  <Input 
                    id="category" 
                    name="category" 
                    value={updatedGround.category || ''} 
                    onChange={handleInputChange} 
                  />
                ) : (
                  <div className="p-2 bg-muted rounded-md">{ground.category}</div>
                )}
              </div>

              {/* Timing */}
              <div className="space-y-2">
                <Label htmlFor="timings">Available Hours</Label>
                {editMode ? (
                  <Input 
                    id="timings" 
                    name="timings" 
                    value={updatedGround.timings || ''} 
                    onChange={handleInputChange} 
                  />
                ) : (
                  <div className="p-2 bg-muted rounded-md">{ground.timings}</div>
                )}
              </div>

              {/* Pricing */}
              <div className="space-y-2">
                <Label htmlFor="isPaid">Pricing Type</Label>
                {editMode ? (
                  <Select 
                    onValueChange={handleIsPaidChange} 
                    defaultValue={updatedGround.isPaid ? "true" : "false"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select pricing option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">Free to use</SelectItem>
                      <SelectItem value="true">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-2 bg-muted rounded-md">
                    {ground.isPaid ? "Paid" : "Free to use"}
                  </div>
                )}
              </div>

              {/* Price (if paid) */}
              {(ground.isPaid || updatedGround.isPaid) && (
                <div className="space-y-2">
                  <Label htmlFor="price">Price (per hour)</Label>
                  {editMode ? (
                    <Input 
                      id="price" 
                      name="price" 
                      type="number" 
                      value={updatedGround.price || 0} 
                      onChange={handleInputChange} 
                    />
                  ) : (
                    <div className="p-2 bg-muted rounded-md">
                      ${ground.price?.toFixed(2)}
                    </div>
                  )}
                </div>
              )}

              {/* Created Date */}
              <div className="space-y-2">
                <Label>Created On</Label>
                <div className="p-2 bg-muted rounded-md">
                  {new Date(ground.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Current Status */}
              <div className="space-y-2">
                <Label>Current Status</Label>
                <div className="p-2 bg-muted rounded-md font-medium">
                  <span className={
                    ground.status === "pending" ? "text-yellow-500" :
                    ground.status === "approved" ? "text-green-500" :
                    "text-red-500"
                  }>
                    {ground.status.charAt(0).toUpperCase() + ground.status.slice(1)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle>Ground Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(editMode ? updatedGround.images : ground.images)?.map((img, index) => (
                  <div key={index} className="relative aspect-video rounded-lg overflow-hidden border group">
                    {img.includes('cloudinary') ? (
                      <CldImage
                        width={600}
                        height={400}
                        src={img.split('/').pop()?.split('.')[0] || ''}
                        alt={`Ground image ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <img 
                        src={img} 
                        alt={`Ground image ${index + 1}`} 
                        className="object-cover w-full h-full"
                      />
                    )}
                    
                    {/* Delete image button (only visible in edit mode) */}
                    {editMode && (
                      <button 
                        onClick={() => handleDeleteImage(index)}
                        className="absolute top-2 right-2 bg-red-500 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete image"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}

                {(editMode && updatedGround.images?.length === 0) && (
                  <div className="col-span-2 p-8 border border-dashed rounded-lg text-center text-muted-foreground">
                    No images available. You should add at least one image before saving.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location">
          <Card>
            <CardHeader>
              <CardTitle>Location Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                {editMode ? (
                  <Input 
                    id="address" 
                    name="address" 
                    value={updatedGround.location?.address || ''} 
                    onChange={handleLocationChange} 
                  />
                ) : (
                  <div className="p-2 bg-muted rounded-md">{ground.location.address}</div>
                )}
              </div>

              {/* City & State */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  {editMode ? (
                    <Input 
                      id="city" 
                      name="city" 
                      value={updatedGround.location?.city || ''} 
                      onChange={handleLocationChange} 
                    />
                  ) : (
                    <div className="p-2 bg-muted rounded-md">{ground.location.city}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  {editMode ? (
                    <Input 
                      id="state" 
                      name="state" 
                      value={updatedGround.location?.state || ''} 
                      onChange={handleLocationChange} 
                    />
                  ) : (
                    <div className="p-2 bg-muted rounded-md">{ground.location.state}</div>
                  )}
                </div>
              </div>

              {/* Map placeholder - in a real app you might include a map component */}
              <div className="mt-4 bg-muted h-64 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Map view would be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Changes button when in edit mode */}
      {editMode && (
        <Button 
          onClick={handleSaveChanges} 
          className="mt-6 w-full"
          disabled={actionLoading}
        >
          {actionLoading ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
              Saving...
            </>
          ) : "Save Changes"}
        </Button>
      )}

      {/* Approval/Rejection Actions */}
      <div className="mt-6 flex gap-4">
        <Button 
          onClick={() => handleAction("approve")} 
          variant="default" 
          className="flex-1 bg-green-600 hover:bg-green-700"
          disabled={actionLoading}
        >
          {actionLoading ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
              Processing...
            </>
          ) : "Approve Ground"}
        </Button>
        <Button 
          onClick={() => handleAction("reject")} 
          variant="destructive" 
          className="flex-1"
          disabled={actionLoading}
        >
          {actionLoading ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
              Processing...
            </>
          ) : "Reject Ground"}
        </Button>
      </div>
    </div>
  );
}