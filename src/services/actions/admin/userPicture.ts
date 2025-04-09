"use server";

import mutate from "../mutate";

export async function updateUserPicture(image: File): Promise<boolean> {
  try {
    const uploadFormData = new FormData();
    uploadFormData.append("image", image);

    const response = await mutate<{ _id: string }>(`/users/me/picture`, "PATCH", uploadFormData);

    if (response.status !== "SUCCESS") {
      throw new Error("Failed to change Profile Image");
    }

    return true; // Deletion was successful
  } catch (error) {
    console.error("Error deleting entity:", error);
    return false; // Return false on failure
  }
}
