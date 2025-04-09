"use server";

import { StateForm } from "@/types/locations/statesForm";
import { z } from "zod";
import mutate from "../mutate";

// Zod schema for validation
const stateSchema = z.object({
  name: z.string().min(1, { message: "State name is required" }).max(50, { message: "State name must not exceed 50 characters" }),

  stateCode: z
    .string()
    .min(1, { message: "State code is required" })
    .max(50, { message: "State code must not exceed 50 characters" }),

  country: z.string().min(1, { message: "Country is required" }).max(50, { message: "Country cannot exceed 50 characters" }),
});

export async function postState(state: StateForm, formData: FormData): Promise<StateForm> {
  // Extract form data
  const rawData = {
    id: formData.get("id") as string,
    name: formData.get("name") as string,
    stateCode: formData.get("stateCode") as string,
    country: formData.get("country") as string,

    phoneCode: formData.get("phoneCode") as string,
    languages: formData.getAll("languages") as string[],
  };

  console.log("rawData ++", rawData);

  // Helper function to generate the state object
  const generateState = (errors: Record<string, string[]> = {}, globalError?: string, successMessage?: string): StateForm => ({
    id: { value: rawData.id, errors: [] },
    name: { value: rawData.name, errors: errors.name || [] },
    stateCode: { value: rawData.stateCode, errors: errors.stateCode || [] },
    country: { value: rawData.country, errors: errors.country || [] },

    globalError,
    successMessage,
  });
  try {
    // Validate form data using Zod schema
    const validatedData = stateSchema.safeParse(rawData);
    // If validation fails, return the state with validation errors
    if (!validatedData.success) {
      const errors = validatedData.error.flatten().fieldErrors;

      return generateState(errors, "Validation failed. Please check the form fields.");
    }

    const response = await mutate<{ _id: string }>(`/states${rawData.id ? "/" + rawData.id : ""}`, rawData.id ? "PUT" : "POST", {
      name: rawData.name,
      stateCode: rawData.stateCode,
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

    rawData.id = response.data._id;

    // Return success state with a success message
    return generateState({}, undefined, "State saved successfully!");
  } catch (e) {
    console.error("PERFORMER CREATION ERROR: ", e);
    return generateState({}, "An unexpected error occurred.");
  }
}
