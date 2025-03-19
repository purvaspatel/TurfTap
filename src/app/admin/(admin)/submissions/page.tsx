import { connectDB } from "@/app/lib/db";
import { Ground } from "@/app/models/Ground";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function AdminDashboard() {
  await connectDB();
  const grounds = await Ground.find().sort({ createdAt: -1 });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {grounds.map((ground) => (
          <div key={ground._id} className="p-4 border rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold">{ground.title}</h2>
            <p className="text-sm text-gray-500">{ground.location.city}, {ground.location.state}</p>

            {/* Status Badge */}
            <Badge
              variant={
                ground.status === "approved" ? "default" :
                ground.status === "rejected" ? "destructive" :
                "secondary"
              }
              className="mt-2"
            >
              {ground.status}
            </Badge>

            {/* View Details Button */}
            <Link href={`/admin/grounds/${ground._id}`}>
              <Button className="mt-4">Review</Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
