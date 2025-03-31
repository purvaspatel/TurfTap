// app/top-contributors/page.tsx
import TopContributors from "@/components/user/topcontributors";

export const metadata = {
  title: "Top Contributors - TurfTap",  
  description: "View the top contributors on TurfTap based on their points"
};

export default function TopContributorsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Top Contributors Leaderboard
      </h1>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
        These community members have earned the most TurfTap points by contributing quality content, 
        submitting verified grounds, and actively participating in discussions.
      </p>
      
      <TopContributors limit={15} />
    </div>
  );
}