"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/admin/api/login", {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      toast.success("Login successful!");
      router.push("/admin");
    } else {
      toast.error("Invalid credentials");
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-sm">
      <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <Input type="text" name="username" placeholder="Username" onChange={handleChange} required />
        <Input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <Button type="submit">Login</Button>
      </form>
    </div>
  );
}
