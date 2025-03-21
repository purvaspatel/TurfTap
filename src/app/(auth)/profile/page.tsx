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
                    <div className="bg-green-100 px-6 py-4 rounded-xl w-full text-center">
                        <p className="text-sm text-gray-500 font-semibold">Turftap Points</p>
                        <p className="text-3xl font-bold mt-1">{session.user.turftapPoints || 0}</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}