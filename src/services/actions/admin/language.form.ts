"use server";

import { z } from "zod";
import { LanguageForm } from "@/types/locations/languageForm";
import mutate from "../mutate";

// Zod schema for validation
const languageSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Language name is required" })
    .max(50, { message: "Language name must not exceed 50 characters" }),

  code: z
    .string()
    .min(1, { message: "Language code is required" })
    .max(3, { message: "Language code must be at most 3 characters" }),
});

export async function postLanguage(state: LanguageForm, formData: FormData): Promise<LanguageForm> {
  // Extract form data
  const rawData = {
    id: formData.get("id") as string,
    name: formData.get("name") as string,
    code: formData.get("code") as string,
  };

  // Helper function to generate the state object
  const generateState = (errors: Record<string, string[]> = {}, globalError?: string, successMessage?: string): LanguageForm => ({
    id: { value: rawData.id, errors: [] },
    name: { value: rawData.name, errors: errors.name || [] },
    code: { value: rawData.code, errors: errors.code || [] },
    globalError,
    successMessage,
  });
  try {
    // Validate form data using Zod schema
    const validatedData = languageSchema.safeParse(rawData);
    // If validation fails, return the state with validation errors
    if (!validatedData.success) {
      const errors = validatedData.error.flatten().fieldErrors;

      return generateState(errors, "Validation failed. Please check the form fields.");
    }

    const response = await mutate<{ _id: string }>(
      `/languages${rawData.id ? "/" + rawData.id : ""}`,
      rawData.id ? "PUT" : "POST",
      {
        name: rawData.name,
        code: rawData.code,
      }
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
    return generateState({}, undefined, "Language saved successfully!");
  } catch (e) {
    console.error("PERFORMER CREATION ERROR: ", e);
    return generateState({}, "An unexpected error occurred.");
  }
}
