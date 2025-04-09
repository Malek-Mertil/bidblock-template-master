"use server";

import { ApiEventDetails } from "@/types/events/event";

const apiUrl = process.env.BACKEND_API_URL;

export async function getEvent(id: string): Promise<ApiEventDetails | null> {
  // Replace with actual data fetching (DB query, API call, etc.)
  const res = await fetch(`${apiUrl}/events/${id}`, {
    cache: "no-store", // Disable cache for fresh data
  });

  if (!res.ok) return null;
  return res.json();
}
