"use server";

import { getSession } from "@/utils/session";
const apiUrl = process.env.BACKEND_API_URL;

if (!apiUrl) {
  throw new Error("BACKEND_API_URL is not defined in environment variables");
}

export async function startTicketmasterImport(): Promise<boolean> {
  try {
    const JWT = await getSession();
    // Construct the API URL
    const url = `${apiUrl}/import/ticketmaster`;
    // Send a DELETE request to remove the entity
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JWT}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to start import");
    }

    return true; // Deletion was successful
  } catch (error) {
    console.error("Error start import: ", error);
    return false; // Return false on failure
  }
}
