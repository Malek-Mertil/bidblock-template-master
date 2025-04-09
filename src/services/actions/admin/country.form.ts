"use server";

import { z } from "zod";
import { CountryForm } from "@/types/locations/countryForm";
import mutate from "../mutate";

// Define allowed image types and maximum file size (in bytes)
const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB
const ACCEPTED_IMAGE_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Zod schema for validation
const countrySchema = z.object({
  flag: z
    .any()
    .refine((file) => !!file, "Image is required")
    .refine((file) => file && file.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => file && ACCEPTED_IMAGE_MIME_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),

  // The country name must be a string with a minimum length of 1 character
  name: z
    .string()
    .min(1, { message: "Country name is required" })
    .max(100, { message: "Country name cannot exceed 100 characters" }),

  // ISO2 code must be a string with exactly 2 characters
  iso2: z
    .string()
    .length(2, { message: "ISO2 code must be exactly 2 characters" })
    .regex(/^[A-Z]{2}$/, { message: "ISO2 code must only contain uppercase letters" }),

  // ISO3 code must be a string with exactly 3 characters
  iso3: z
    .string()
    .length(3, { message: "ISO3 code must be exactly 3 characters" })
    .regex(/^[A-Z]{3}$/, { message: "ISO3 code must only contain uppercase letters" }),

  // phoneCode is optional and must be a string if provided
  phoneCode: z
    .string()
    .optional()
    .refine((val) => val === undefined || /^\+?\d+$/.test(val), {
      message: "Phone code must be a valid international format (e.g., +1, +44)",
    }),

  currency: z.string().min(1, { message: "currency is required" }).max(50, { message: "currency cannot exceed 50 characters" }),

  languages: z.union([
    z.string().min(1, { message: "Language is required" }).max(50, { message: "Language cannot exceed 50 characters" }),

    z
      .array(z.string())
      .min(1, { message: "At least one performer is required" })
      .max(50, { message: "Languages cannot exceed 50 items" }),
  ]),
});

export async function postCountry(state: CountryForm, formData: FormData): Promise<CountryForm> {
  // Extract form data
  const rawData = {
    id: formData.get("id") as string,
    name: formData.get("name") as string,
    iso2: formData.get("iso2") as string,
    iso3: formData.get("iso3") as string,
    flag: formData.get("flag") as File | null,
    currency: formData.get("currency") as string,
    phoneCode: formData.get("phoneCode") as string,
    languages: formData.getAll("languages") as string[],
  };

  // Helper function to generate the state object
  const generateState = (errors: Record<string, string[]> = {}, globalError?: string, successMessage?: string): CountryForm => ({
    id: { value: rawData.id, errors: [] },
    name: { value: rawData.name, errors: errors.name || [] },
    iso2: { value: rawData.iso2, errors: errors.iso2 || [] },
    iso3: { value: rawData.iso3, errors: errors.iso3 || [] },
    flag: { value: rawData.flag, errors: errors.flag || [] },
    currency: { value: rawData.currency, errors: errors.currency || [] },
    languages: { value: rawData.languages, errors: errors.languages || [] },
    phoneCode: { value: rawData.phoneCode, errors: errors.phoneCode || [] },
    globalError,
    successMessage,
  });
  try {
    // Validate form data using Zod schema
    const validatedData = countrySchema.safeParse(rawData);
    // If validation fails, return the state with validation errors
    if (!validatedData.success) {
      const errors = validatedData.error.flatten().fieldErrors;

      return generateState(errors, "Validation failed. Please check the form fields.");
    }

    // Create a new FormData object to send the file
    const uploadFormData = new FormData();
    uploadFormData.append("name", rawData.name);
    uploadFormData.append("iso2", rawData.iso2);
    uploadFormData.append("iso3", rawData.iso3);
    uploadFormData.append("currency", rawData.currency);
    rawData.languages.forEach((language) => uploadFormData.append("languages", language));
    uploadFormData.append("phoneCode", rawData.phoneCode);
    if (rawData.flag) {
      uploadFormData.append("flag", rawData.flag);
    }

    const response = await mutate<{ _id: string }>(
      `/countries${rawData.id ? "/" + rawData.id : ""}`,
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

    rawData.id = response.data._id;

    // Return success state with a success message
    return generateState({}, undefined, "Country saved successfully!");
  } catch (e) {
    console.error("PERFORMER CREATION ERROR: ", e);
    return generateState({}, "An unexpected error occurred.");
  }
}
