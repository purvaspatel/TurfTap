import { getSession } from "@/app/lib/session";
import { connectDB } from "@/app/lib/db";
import { Ground } from "@/app/models/Ground";
import Link from "next/link";

export default async function UserGroundsPage() {
  const session = await getSession();
  if (!session) return null;

  await connectDB();
  const userGrounds = await Ground.find({ submittedBy: session.user.id });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Ground Submissions</h1>
      <Link href="/grounds/create" className="px-4 py-2 bg-blue-500 text-white rounded">
        + Add New Ground
      </Link>
      <ul className="mt-4">
        {userGrounds.map((ground) => (
          <li key={ground._id} className="p-4 bg-white shadow-md rounded-lg mb-2">
            <h2 className="font-semibold">{ground.title}</h2>
            <p>Status: {ground.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
