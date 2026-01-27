"use client";

export default function useUser() {
  if (typeof window === "undefined") return null;

  const userData = localStorage.getItem("user");
  if (!userData) return null;

  return JSON.parse(userData);
}
