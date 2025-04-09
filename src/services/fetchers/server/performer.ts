"use server";

import { ApiPerformerDetails } from "@/types/performers/performers";

const apiUrl = process.env.BACKEND_API_URL;

export async function getPerformer(id: string): Promise<ApiPerformerDetails | null> {
  // Replace with actual data fetching (DB query, API call, etc.)
  const res = await fetch(`${apiUrl}/performers/${id}`, {
    cache: "no-store", // Disable cache for fresh data
  });

  if (!res.ok) return null;
  return res.json();
}
