"use client";

import { useAuth } from "@/components/AuthProvider";

export default function Dashboard() {
  const user = useAuth()?.user;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        Welcome {user?.name ?? "User"} to Kidscode 🎉
      </h1>
      <p className="mt-2">
        Your account is verified and logged in successfully!
      </p>
    </div>
  );
}
