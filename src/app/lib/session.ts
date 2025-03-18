import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function getSession() {
  return await getServerSession(authOptions);
}
