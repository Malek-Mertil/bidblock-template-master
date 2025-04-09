"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { VenueForm } from "@/types/venues/venueForm";
import { isURL } from "@/utils/helpers";
import mutate from "../mutate";

// Define allowed image types and maximum file size (in bytes)
const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB
const ACCEPTED_IMAGE_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Zod schema for validation
const venueSchema = z.object({
  image: z
    .any()
    .optional()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
      message: `Max image size is 5MB.`,
    })
    .refine((file) => !file || ACCEPTED_IMAGE_MIME_TYPES.includes(file.type), {
      message: "Only .jpg, .jpeg, .png and .webp formats are supported.",
    }),

  name: z.string().min(1, { message: "Name is required" }).max(255, { message: "Name must be less than 255 characters" }),

  description: z.string().max(1000, { message: "Description must be less than 1000 characters" }).optional(),

  country: z.string().min(1, { message: "Country is required" }).max(50, { message: "Country cannot exceed 50 characters" }),

  state: z.string().min(1, { message: "State is required" }).max(50, { message: "State cannot exceed 50 characters" }),

  city: z.string().max(50, { message: "City must be less than 1000 characters" }).optional(),

  socialLinks: z
    .string()
    .refine(
      (social_links) => {
        try {
          if (!social_links || social_links.length === 0) {
            return true;
          }
          const socialLinks = JSON.parse(social_links);
          if (!Array.isArray(socialLinks)) {
            return false;
          }

          return socialLinks.every(
            (link) => typeof link.platform === "string" && typeof link.url === "string" && isURL(link.url)
          );
        } catch {
          return false;
        }
      },
      { message: "Invalid social links format." }
    )
    .optional(),

  address: z.string().max(500, { message: "Address must be less than 500 characters" }).optional(),

  capacity: z
    .union([z.string(), z.number()])
    .transform((value) => (typeof value === "string" ? Number(value) : value))
    .refine((value) => Number.isInteger(value), {
      message: "Capacity must be an integer",
    })
    .refine((value) => value >= 0, {
      message: "Capacity must be 0 or more",
    })
    .optional(),
});

export async function postVenue(state: VenueForm, formData: FormData): Promise<VenueForm> {
  // Extract form data
  const rawData = {
    id: formData.get("id") as string,
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    image: formData.get("image") as File | null,
    socialLinks: formData.get("socialLinks") as string,
    address: formData.get("address") as string,
    city: formData.get("city") as string,
    state: formData.get("state") as string,
    country: formData.get("country") as string,
    capacity: formData.get("capacity") as string,
  };

  // Helper function to generate the state object
  const generateState = (errors: Record<string, string[]> = {}, globalError?: string, successMessage?: string): VenueForm => ({
    id: { value: rawData.id, errors: [] },
    name: { value: rawData.name, errors: errors.name || [] },
    description: { value: rawData.description, errors: errors.description || [] },
    image: { value: rawData.image, errors: errors.image || [] },
    socialLinks: { value: rawData.socialLinks, errors: errors.socialLinks || [] },
    address: { value: rawData.address, errors: errors.address || [] },
    city: { value: rawData.city, errors: errors.city || [] },
    state: { value: rawData.state, errors: errors.state || [] },
    country: { value: rawData.country, errors: errors.country || [] },
    capacity: { value: rawData.capacity, errors: errors.capacity || [] },
    globalError,
    successMessage,
  });
  let id = "";
  try {
    // Validate form data using Zod schema
    const validatedData = venueSchema.safeParse(rawData);

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
    uploadFormData.append("socialLinks", rawData.socialLinks);
    uploadFormData.append("address", rawData.address);
    uploadFormData.append("city", rawData.city);
    uploadFormData.append("state", rawData.state);
    uploadFormData.append("country", rawData.country);
    uploadFormData.append("capacity", rawData.capacity);

    const response = await mutate<{ _id: string }>(
      `/venues${rawData.id ? "/" + rawData.id : ""}`,
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
      return generateState({}, undefined, "Venue saved successfully!");
    }

    id = response.data._id;
  } catch (e) {
    console.error("Venue CREATION ERROR: ", e);
    return generateState({}, "An unexpected error occurred.");
  }
  redirect(`/admin/venues/manage-venues/${id}?save=true`);
}
