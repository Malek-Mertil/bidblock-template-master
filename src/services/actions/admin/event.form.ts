"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { EventForm } from "@/types/events/event";
import mutate from "../mutate";

// Define allowed image types and maximum file size (in bytes)
const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB
const ACCEPTED_IMAGE_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Zod schema for validation

const eventSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }).max(255, { message: "Name must be less than 255 characters" }),

    image: z
      .any()
      .refine((file) => !!file, "Image is required")
      .refine((file) => file && file.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
      .refine(
        (file) => file && ACCEPTED_IMAGE_MIME_TYPES.includes(file?.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported."
      ),

    description: z.string().max(1000, { message: "Description must be less than 1000 characters" }).optional(),

    startDateTime: z.string().datetime({ message: "startDateTime must be a valid ISO 8601 date" }),

    endDateTime: z
      .string()
      .transform((val) => (val === "" ? null : val))
      .nullable()
      .optional()
      .refine((val) => val === null || z.string().datetime().safeParse(val).success, {
        message: "endDateTime must be a valid ISO 8601 date",
      }),
    venue: z.string().min(1, { message: "Venue is required" }),
    eventType: z.string().min(1, { message: "Event type is required" }),
    performers: z.union([
      z.string().min(1, { message: "Performer is required" }).max(50, { message: "Performer cannot exceed 50 characters" }),
      z
        .array(z.string())
        .min(1, { message: "At least one performer is required" })
        .max(50, { message: "Performers cannot exceed 50 items" }),
    ]),

    categories: z.union([
      z.string().min(1, { message: "Category is required" }).max(50, { message: "Category cannot exceed 50 characters" }),

      z
        .array(z.string())
        .min(1, { message: "At least one category is required" })
        .max(50, { message: "Categories cannot exceed 50 items" }),
    ]),

    // ticketTypes is a string representing a JSON array
    ticketTypes: z
      .string()
      .min(1, { message: "Ticket Types are required" })
      .refine(
        (val) => {
          try {
            const parsed = JSON.parse(val);
            return (
              Array.isArray(parsed) &&
              parsed.every((item) => {
                if (
                  typeof item === "object" &&
                  item !== null &&
                  "ticketType" in item &&
                  "maxPrice" in item &&
                  "currency" in item
                ) {
                  const typedItem = item as { ticketType: string; maxPrice: string; currency: string };
                  return (
                    typeof typedItem.ticketType === "string" &&
                    typedItem.ticketType.length > 0 &&
                    typedItem.ticketType.length < 50 &&
                    parseInt(typedItem.maxPrice) >= 0 &&
                    parseInt(typedItem.maxPrice) <= 999999999 &&
                    typeof typedItem.currency === "string" &&
                    typedItem.currency.length > 0 &&
                    typedItem.currency.length < 50
                  );
                }
                return false;
              })
            );
          } catch {
            return false;
          }
        },
        { message: "Invalid Ticket Types format." }
      )
      .optional(),
  })
  .refine(
    (data) => {
      if (!data.endDateTime) return true; // If endDateTime is not provided, it's valid
      return new Date(data.endDateTime).getTime() > new Date(data.startDateTime).getTime();
    },
    {
      message: "End date must be after the start date",
      path: ["endDateTime"], // This makes sure the error is attached to the endDateTime field
    }
  );

export async function postEvent(state: EventForm, formData: FormData): Promise<EventForm> {
  // Extract form data
  const rawData = {
    id: formData.get("id") as string,
    name: formData.get("name") as string,
    image: formData.get("image") as File | null,
    startDateTime: formData.get("startDateTime") as string,
    isTimeUnset: formData.get("isTimeUnset") as string,
    endDateTime: formData.get("endDateTime") as string,
    venue: formData.get("venue") as string,
    eventType: formData.get("eventType") as string,
    performers: formData.getAll("performers") as string[],
    categories: formData.getAll("categories") as string[],
    description: formData.get("description") as string,
    ticketTypes: formData.get("ticketTypes") as string,
  };

  // Helper function to generate the state object
  const generateState = (errors: Record<string, string[]> = {}, globalError?: string, successMessage?: string): EventForm => ({
    id: { value: rawData.id, errors: [] },
    name: { value: rawData.name, errors: errors.name || [] },
    image: { value: rawData.image, errors: errors.image || [] },
    startDateTime: { value: rawData.startDateTime, errors: errors.startDateTime || [] },
    isTimeUnset: { value: rawData.isTimeUnset, errors: errors.isTimeUnset || [] },
    endDateTime: { value: rawData.endDateTime, errors: errors.endDateTime || [] },
    eventType: { value: rawData.eventType, errors: errors.eventType || [] },
    venue: { value: rawData.venue, errors: errors.venue || [] },
    performers: { value: rawData.performers, errors: errors.performers || [] },
    categories: { value: rawData.categories, errors: errors.categories || [] },
    description: { value: rawData.description, errors: errors.description || [] },
    ticketTypes: { value: rawData.ticketTypes, errors: errors.ticketTypes || [] },
    globalError,
    successMessage,
  });
  let id = "";
  try {
    // Validate form data using Zod schema
    const validatedData = eventSchema.safeParse(rawData);
    // If validation fails, return the state with validation errors
    if (!validatedData.success) {
      const errors = validatedData.error.flatten().fieldErrors;

      return generateState(errors, "Validation failed. Please check the form fields.");
    }

    // Create a new FormData object to send the file
    const uploadFormData = new FormData();
    uploadFormData.append("name", rawData.name);
    if (rawData.image) {
      uploadFormData.append("image", rawData.image);
    }
    uploadFormData.append("startDateTime", rawData.startDateTime);
    uploadFormData.append("isTimeUnset", rawData.isTimeUnset);

    if (rawData.endDateTime) {
      uploadFormData.append("endDateTime", rawData.endDateTime);
    }

    uploadFormData.append("venue", rawData.venue);
    uploadFormData.append("eventType", rawData.eventType);
    rawData.performers.forEach((performer) => uploadFormData.append("performers", performer));
    rawData.categories.forEach((category) => uploadFormData.append("categories", category));
    uploadFormData.append("description", rawData.description || "");
    uploadFormData.append("ticketTypes", rawData.ticketTypes);

    const response = await mutate<{ _id: string }>(
      `/events${rawData.id ? "/" + rawData.id : ""}`,
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
      return generateState({}, undefined, "Event saved successfully!");
    }

    id = response.data._id;
  } catch (e) {
    console.error("EVENT CREATION ERROR === >>> ", e);
    return generateState({}, "An unexpected error occurred.");
  }
  redirect(`/admin/events/manage-events/${id}?save=true`);
}
