"use server";

// utils/auth.ts

import { getSession } from "./session";

// Function to check if the user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session; // Returns true if a session exists, false otherwise
}
