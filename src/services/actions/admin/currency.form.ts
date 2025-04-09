"use server";

import { CurrencyForm } from "@/types/locations/currencies";
import { z } from "zod";
import mutate from "../mutate";

// Zod schema for validation
const currencySchema = z.object({
  name: z
    .string()
    .min(1, { message: "Currency name is required" })
    .max(50, { message: "Currency name must not exceed 50 characters" }),

  code: z
    .string()
    .min(1, { message: "Currency code is required" })
    .max(3, { message: "Currency code must be at most 3 characters" })
    .regex(/^[A-Z]{3}$/, { message: "Currency code must be 3 uppercase letters (e.g., USD, EUR)" }),

  symbole: z.string().max(10, { message: "Symbol must not exceed 10 characters" }).optional(),
});

export async function postCurrency(state: CurrencyForm, formData: FormData): Promise<CurrencyForm> {
  // Extract form data
  const rawData = {
    id: formData.get("id") as string,
    name: formData.get("name") as string,
    code: formData.get("code") as string,
    symbol: formData.get("symbol") as string,
  };

  // Helper function to generate the state object
  const generateState = (errors: Record<string, string[]> = {}, globalError?: string, successMessage?: string): CurrencyForm => ({
    id: { value: rawData.id, errors: [] },
    name: { value: rawData.name, errors: errors.name || [] },
    code: { value: rawData.code, errors: errors.code || [] },
    symbol: { value: rawData.symbol, errors: errors.symbol || [] },
    globalError,
    successMessage,
  });
  try {
    // Validate form data using Zod schema
    const validatedData = currencySchema.safeParse(rawData);
    // If validation fails, return the state with validation errors
    if (!validatedData.success) {
      const errors = validatedData.error.flatten().fieldErrors;

      return generateState(errors, "Validation failed. Please check the form fields.");
    }

    const response = await mutate<{ _id: string }>(
      `/currencies${rawData.id ? "/" + rawData.id : ""}`,
      rawData.id ? "PUT" : "POST",
      {
        name: rawData.name,
        code: rawData.code,
        symbol: rawData.symbol,
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
    return generateState({}, undefined, "Currency saved successfully!");
  } catch (e) {
    console.error("PERFORMER CREATION ERROR: ", e);
    return generateState({}, "An unexpected error occurred.");
  }
}
