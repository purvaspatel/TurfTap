import { getSession } from "@/app/lib/session";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import Image from "next/image";

async function preloadImage(url: string) {
    try {
      await fetch(url, { cache: "no-cache" }); // Force load
    } catch (error) {
      console.error("Image preload failed:", error);
    }
  }

export default async function ProfilePage() {
    const session = await getSession();

    if (!session) {
        return redirect("/u/signin");
    }

    console.log("Profile Image URL:", session.user.image);
    if (session.user.image) {
        await preloadImage(session.user.image);
    }
    
    return (

        

        <div className="flex items-center justify-center min-h-screen bg-white">
            <Card className="w-full max-w-md p-8 shadow-sm border border-gray-100">
                <div className="flex flex-col items-center space-y-6">
                    {/* Profile Image - Using regular img tag to avoid Next.js domain restrictions */}
                    <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                        {session.user.image ? (
                            // Using regular img tag instead of Next/Image to avoid domain restrictions
                            <img
                                src={session.user.image}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            // Fallback to local image using Next/Image (which is allowed)
                            <Image
                                src="/default-avatar.png"
                                width={80}
                                height={80}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>

                    {/* User Information */}
                    <div className="text-center space-y-1">
                        <h2 className="text-xl font-medium text-gray-900">{session.user.name}</h2>
                        <p className="text-sm text-gray-500">{session.user.email}</p>
                    </div>

                    {/* Points Display */}
                    <div className="bg-gray-50 px-6 py-4 rounded-xl w-full text-center">
                        <p className="text-sm text-gray-500">Turftap Points</p>
                        <p className="text-3xl font-light mt-1">{session.user.turftapPoints || 0}</p>
                    </div>

                    {/* Activity Section */}
                    <div className="w-full pt-4">
                        <p className="text-xs text-gray-400 mb-3">Recent Activity</p>
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                            <p className="text-sm text-gray-500">No recent activity</p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}