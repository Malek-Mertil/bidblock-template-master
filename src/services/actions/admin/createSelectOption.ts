"use server";

import { getSession } from "@/utils/session";

const apiUrl = process.env.BACKEND_API_URL;
export async function createSelectOption(name: string, endpoint: string): Promise<{ label: string; value: string } | null> {
  // Validate the name parameter
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    throw new Error("Name is required and must be a non-empty string.");
  }

  try {
    const JWT = await getSession();
    // Send a POST request to the API endpoint
    const response = await fetch(`${apiUrl}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JWT}`,
      },
      body: JSON.stringify({ name: name.trim() }), // Trim whitespace from the name
    });

    // Check if the response is OK (status code 2xx)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create new entity");
    }

    // Parse the response JSON
    const data = await response.json();

    // Ensure the response contains the expected fields
    if (!data.name || !data._id) {
      throw new Error("Invalid response from the server");
    }

    // Return the name and _id from the response
    return {
      label: data.name,
      value: data._id,
    };
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error creating select option:", error);
    return null;
  }
}
