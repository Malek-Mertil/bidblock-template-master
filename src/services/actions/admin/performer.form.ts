"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { PerformerForm } from "@/types/performers/PerformerForm";
import { isURL } from "@/utils/helpers";
import mutate from "../mutate";

// Define allowed image types and maximum file size (in bytes)
const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB
const ACCEPTED_IMAGE_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Zod schema for validation
const performerSchema = z.object({
  image: z
    .any()
    .refine((file) => !!file, "Image is required")
    .refine((file) => file && file.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => file && ACCEPTED_IMAGE_MIME_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),

  name: z.string().min(1, { message: "Name is required" }).max(255, { message: "Name must be less than 255 characters" }),

  description: z.string().max(1000, { message: "Description must be less than 1000 characters" }).optional(),

  categories: z.union([
    z.string().min(1, { message: "Category is required" }).max(50, { message: "Category cannot exceed 50 characters" }),

    z
      .array(z.string())
      .min(1, { message: "At least one category is required" })
      .max(50, { message: "Categories cannot exceed 50 items" }),
  ]),

  // ticketTypes is a string representing a JSON array
  socialLinks: z
    .string()
    .min(1, { message: "Social links are required" })
    .refine(
      (social_links) => {
        try {
          if (!social_links || social_links.length === 0) {
            return true;
          }
          const socialLinks = JSON.parse(social_links);
          if (socialLinks) {
            if (!Array.isArray(socialLinks)) {
              throw new Error("Social Links must be an array");
            }

            if (
              !socialLinks.every((link) => typeof link.platform === "string" && typeof link.url === "string" && isURL(link.url))
            ) {
              throw new Error("Social Links must be valid URLs");
            }
          }

          return true;
        } catch {
          return false;
        }
      },
      { message: "Invalid Ticket Types format." }
    )
    .optional(),
});

export async function postPerformer(state: PerformerForm, formData: FormData): Promise<PerformerForm> {
  // Extract form data
  const rawData = {
    id: formData.get("id") as string,
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    image: formData.get("image") as File | null,
    categories: formData.getAll("categories") as string[],
    socialLinks: formData.get("socialLinks") as string,
  };

  // Helper function to generate the state object
  const generateState = (
    errors: Record<string, string[]> = {},
    globalError?: string,
    successMessage?: string
  ): PerformerForm => ({
    id: { value: rawData.id, errors: [] },
    name: { value: rawData.name, errors: errors.name || [] },
    description: { value: rawData.description, errors: errors.description || [] },
    image: { value: rawData.image, errors: errors.image || [] },
    categories: { value: rawData.categories, errors: errors.categories || [] },
    socialLinks: { value: rawData.socialLinks, errors: errors.socialLinks || [] },
    globalError,
    successMessage,
  });
  let id = "";
  try {
    // Validate form data using Zod schema
    const validatedData = performerSchema.safeParse(rawData);
    // If validation fails, return the state with validation errors
    if (!validatedData.success) {
      const errors = validatedData.error.flatten().fieldErrors;

      return generateState(errors, "Validation failed. Please check the form fields.");
    }

    // Create a new FormData object to send the file
    const uploadFormData = new FormData();
    uploadFormData.append("name", rawData.name);
    uploadFormData.append("description", rawData.description);
    if (rawData.image) {
      uploadFormData.append("image", rawData.image);
    }

    rawData.categories.forEach((category) => uploadFormData.append("categories", category));
    uploadFormData.append("socialLinks", rawData.socialLinks);

    const response = await mutate<{ _id: string }>(
      `/performers${rawData.id ? "/" + rawData.id : ""}`,
      rawData.id ? "PUT" : "POST",
      uploadFormData
    );

    if (response.status !== "SUCCESS") {
      // Handle backend validation errors
      if (response.status === "NOT-ALLOWED") {
        return generateState({}, "You are not allowed to do this action");
      } else if (response.status === "VALIDATION-ERROR") {
        return generateState(response.errors, "Validation failed. Please check the form fields.");
      }
      return generateState({}, "An unexpected error occurred.");
    }
    // Return success state with a success message
    if (rawData.id) {
      return generateState({}, undefined, "Performer saved successfully!");
    }
    id = response.data._id;
  } catch (e) {
    console.error("PERFORMER CREATION ERROR: ", e);
    return generateState({}, "An unexpected error occurred.");
  }
  redirect(`/admin/performers/manage-performers/${id}?save=true`);
}
