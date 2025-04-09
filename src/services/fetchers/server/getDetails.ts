"use server";

import { logout } from "@/services/actions/auth";
import { getSession } from "@/utils/session";

const apiUrl = process.env.BACKEND_API_URL;

export async function getDetails<T>(endpoint: string, id: string): Promise<T | null> {
  const JWT = await getSession();

  // Replace with actual data fetching (DB query, API call, etc.)
  const res = await fetch(`${apiUrl}/${endpoint}/${id}`, {
    cache: "no-store", // Disable cache for fresh data
    headers: {
      Authorization: `Bearer ${JWT}`,
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      await logout();
    }
    return null;
  }

  return res.json();
}
