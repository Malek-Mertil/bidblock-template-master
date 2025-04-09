"use server";

import { CategoryForm } from "@/types/locations/categories";
import { z } from "zod";
import mutate from "../mutate";

// Zod schema for validation
const categorySchema = z.object({
  name: z
    .string()
    .min(1, { message: "Category name is required" })
    .max(50, { message: "Category name must not exceed 50 characters" }),
});

export async function postCategory(state: CategoryForm, formData: FormData): Promise<CategoryForm> {
  // Extract form data
  const rawData = {
    id: formData.get("id") as string,
    name: formData.get("name") as string,
  };

  // Helper function to generate the state object
  const generateState = (errors: Record<string, string[]> = {}, globalError?: string, successMessage?: string): CategoryForm => ({
    id: { value: rawData.id, errors: [] },
    name: { value: rawData.name, errors: errors.name || [] },
    globalError,
    successMessage,
  });
  try {
    // Validate form data using Zod schema
    const validatedData = categorySchema.safeParse(rawData);
    // If validation fails, return the state with validation errors
    if (!validatedData.success) {
      const errors = validatedData.error.flatten().fieldErrors;

      return generateState(errors, "Validation failed. Please check the form fields.");
    }

    const response = await mutate<{ _id: string }>(
      `/categories${rawData.id ? "/" + rawData.id : ""}`,
      rawData.id ? "PUT" : "POST",
      {
        name: rawData.name,
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
    return generateState({}, undefined, "Category saved successfully!");
  } catch (e) {
    console.error("PERFORMER CREATION ERROR: ", e);
    return generateState({}, "An unexpected error occurred.");
  }
}
