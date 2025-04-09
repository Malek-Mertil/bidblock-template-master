"use server";

import { EditInfoForm } from "@/types/users/users";
import { z } from "zod";
import mutate from "../mutate";

// Zod schema for validation
const profileInfoSchema = z.object({
  name: z.string().min(2, "Name must contain atleast 6 characters").max(100, "Name must not exceed 100 characters"),

  phoneNumber: z.string().optional(),

  gender: z.string().optional(),

  language: z.string().max(50, { message: "Language cannot exceed 50 characters" }).optional(),

  dateOfBirth: z.string().datetime({ message: "Date of birth must be a valid ISO 8601 date" }).nullable().optional(),
});

export async function postProfileInfo(state: EditInfoForm, formData: FormData): Promise<EditInfoForm> {
  // Extract form data
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phoneNumber: formData.get("phoneNumber") as string,
    gender: formData.get("gender") as string,
    language: formData.get("language") as string,
    dateOfBirth: formData.get("dateOfBirth") as string,
  };

  // Helper function to generate the state object
  const generateState = (errors: Record<string, string[]> = {}, globalError?: string, successMessage?: string): EditInfoForm => ({
    name: { value: rawData.name, errors: errors.name || [] },
    email: { value: rawData.email, errors: errors.email || [] },
    phoneNumber: { value: rawData.phoneNumber, errors: errors.phoneNumber || [] },
    gender: { value: rawData.gender, errors: errors.gender || [] },
    language: { value: rawData.language, errors: errors.language || [] },
    dateOfBirth: { value: rawData.dateOfBirth, errors: errors.dateOfBirth || [] },

    globalError,
    successMessage,
  });
  try {
    // Validate form data using Zod schema
    const validatedData = profileInfoSchema.safeParse(rawData);
    // If validation fails, return the state with validation errors
    if (!validatedData.success) {
      const errors = validatedData.error.flatten().fieldErrors;

      return generateState(errors, "Validation failed. Please check the form fields.");
    }

    const response = await mutate<{ _id: string }>(`/users/me`, "PATCH", {
      name: rawData.name,
      email: rawData.email,
      phoneNumber: rawData.phoneNumber,
      gender: rawData.gender,
      language: rawData.language,
      dateOfBirth: rawData.dateOfBirth,
    });

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
    return generateState({}, undefined, "Profile saved successfully!");
  } catch (e) {
    console.error("PERFORMER CREATION ERROR: ", e);
    return generateState({}, "An unexpected error occurred.");
  }
}
