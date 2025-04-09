"use server";

import { EditAddressForm } from "@/types/users/users";
import { z } from "zod";
import mutate from "../mutate";

// Zod schema for validation
const addressSchema = z.object({
  city: z.string().optional(),

  state: z.string().max(50, { message: "State cannot exceed 50 characters" }).optional(),

  country: z.string().max(50, { message: "Country cannot exceed 50 characters" }).optional(),
});

export async function postAddress(state: EditAddressForm, formData: FormData): Promise<EditAddressForm> {
  // Extract form data
  const rawData = {
    city: formData.get("city") as string,
    state: formData.get("state") as string,
    country: formData.get("country") as string,
  };

  // Helper function to generate the state object
  const generateState = (
    errors: Record<string, string[]> = {},
    globalError?: string,
    successMessage?: string
  ): EditAddressForm => ({
    city: { value: rawData.city, errors: errors.city || [] },
    state: { value: rawData.state, errors: errors.state || [] },
    country: { value: rawData.country, errors: errors.country || [] },

    globalError,
    successMessage,
  });
  try {
    // Validate form data using Zod schema
    const validatedData = addressSchema.safeParse(rawData);
    // If validation fails, return the state with validation errors
    if (!validatedData.success) {
      const errors = validatedData.error.flatten().fieldErrors;

      return generateState(errors, "Validation failed. Please check the form fields.");
    }

    const response = await mutate<{ _id: string }>(`/users/me/address`, "PATCH", {
      city: rawData.city,
      state: rawData.state,
      country: rawData.country,
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
    return generateState({}, undefined, "Address saved successfully!");
  } catch (e) {
    console.error("PERFORMER CREATION ERROR: ", e);
    return generateState({}, "An unexpected error occurred.");
  }
}
