import { getSession } from "@/app/lib/session";
import { connectDB } from "@/app/lib/db";
import { Ground } from "@/app/models/Ground";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MapPin, Clock, DollarSign, Tag } from "lucide-react";

export default async function UserGroundsPage() {
  const session = await getSession();
  if (!session) return null;

  await connectDB();
  const userGrounds = await Ground.find({ submittedBy: session.user.id }).sort({ createdAt: -1 });

  // Function to get status badge colors
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "approved":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "under review":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">Your Contributions</h1>
        <Link href="/grounds/create">
          <Button className=" h-10 px-4 bg-black hover:bg-black/90 text-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Ground
          </Button>
        </Link>
      </div>

      {userGrounds.length === 0 ? (
        <Card className="border-none shadow-sm">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <div className="py-8">
              <p className="mb-4 text-gray-500">You haven't submitted any grounds yet.</p>
              <Link href="/auth/grounds/create">
                <Button className="rounded-full bg-black hover:bg-black/90 text-white">
                  Submit Your First Ground
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {userGrounds.map((ground) => (
            <Link key={ground._id} href={`/auth/grounds/${ground._id}`}>
              <Card className="border-none shadow-sm hover:shadow transition-shadow duration-200 overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/3 h-48 md:h-auto relative bg-gray-100">
                    {ground.images && ground.images[0] ? (
                      <img 
                        src={ground.images[0]} 
                        alt={ground.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <p className="text-gray-400">No image</p>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-medium mb-1">{ground.title}</h2>
                        <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                          {ground.description || "No description provided."}
                        </p>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`${getStatusColor(ground.status)} font-medium ml-2 uppercase text-xs`}
                      >
                        {ground.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mt-2">
                      {ground.location && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600 truncate">
                            {[ground.location.city, ground.location.state].filter(Boolean).join(", ")}
                          </span>
                        </div>
                      )}
                      
                      {ground.timings && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600 truncate">{ground.timings}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          {ground.isPaid ? `₹${ground.price || '0'}/hr` : "Free"}
                        </span>
                      </div>
                      
                      {ground.category && (
                        <div className="flex items-center">
                          <Tag className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600 truncate">{ground.category}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">
                          Submitted: {new Date(ground.createdAt).toLocaleDateString()}
                        </span>
                        <Button variant="ghost" size="sm" className="text-xs text-black hover:bg-gray-100 px-2 rounded-full">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}