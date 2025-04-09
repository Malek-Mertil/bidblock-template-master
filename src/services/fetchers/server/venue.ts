"use server";

import { IVenue } from "@/types/tables/venue";

const apiUrl = process.env.BACKEND_API_URL;

export async function getVenue(id: string): Promise<IVenue | null> {
  // Replace with actual data fetching (DB query, API call, etc.)
  const res = await fetch(`${apiUrl}/venues/${id}`, {
    cache: "no-store", // Disable cache for fresh data
  });

  if (!res.ok) return null;
  return res.json();
}
