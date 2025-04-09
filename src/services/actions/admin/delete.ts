"use server";

import { getSession } from "@/utils/session";

const apiUrl = process.env.BACKEND_API_URL;
/**
 * Deletes an entity from the given API endpoint.
 *
 * @param {string} endpoint - The API endpoint (e.g., "events", "users").
 * @param {string} id - The unique identifier of the entity to be deleted.
 * @returns {Promise<boolean>} - Returns `true` if the deletion was successful, otherwise `false`.
 */
export async function deleteEntity(endpoint: string, id: string): Promise<boolean> {
  try {
    const JWT = await getSession();
    // Construct the API URL
    const url = `${apiUrl}/${endpoint}/${id}`;
    // Send a DELETE request to remove the entity
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JWT}`,
      },
    });

    // Check if the response is successful (status code 2xx)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete entity");
    }

    return true; // Deletion was successful
  } catch (error) {
    console.error("Error deleting entity:", error);
    return false; // Return false on failure
  }
}
