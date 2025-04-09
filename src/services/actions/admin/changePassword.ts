"use server";

import { ChangePasswordForm } from "@/types/users/users";
import { z } from "zod";
import mutate from "../mutate";

// Zod schema for validation
const ChangePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(6, "Password must contain at least 6 characters")
      .max(254, "Password must not exceed 254 characters"),
    newPassword: z
      .string()
      .min(6, "Password must contain at least 6 characters")
      .max(254, "Password must not exceed 254 characters")
      .refine((value) => {
        // Check for at least one uppercase letter
        const hasUpperCase = /[A-Z]/.test(value);
        // Check for at least one lowercase letter
        const hasLowerCase = /[a-z]/.test(value);
        // Check for at least one number
        const hasNumber = /[0-9]/.test(value);

        return hasUpperCase && hasLowerCase && hasNumber;
      }, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
    confirmPassword: z.string(), // Add confirmPassword field
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match", // Error message if passwords don't match
    path: ["confirmPassword"], // Attach the error to the confirmPassword field
  });

export async function changePassword(state: ChangePasswordForm, formData: FormData): Promise<ChangePasswordForm> {
  // Extract form data
  const rawData = {
    oldPassword: formData.get("oldPassword") as string,
    newPassword: formData.get("newPassword") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  // Helper function to generate the state object
  const generateState = (
    errors: Record<string, string[]> = {},
    globalError?: string,
    successMessage?: string
  ): ChangePasswordForm => ({
    oldPassword: { value: rawData.oldPassword, errors: errors.oldPassword || [] },
    newPassword: { value: rawData.newPassword, errors: errors.newPassword || [] },
    confirmPassword: { value: rawData.confirmPassword, errors: errors.confirmPassword || [] },

    globalError,
    successMessage,
  });

  try {
    // Validate form data using Zod schema
    const validatedData = ChangePasswordSchema.safeParse(rawData);
    // If validation fails, return the state with validation errors
    if (!validatedData.success) {
      const errors = validatedData.error.flatten().fieldErrors;
      return generateState(errors, "Validation failed. Please check the form fields.");
    }

    const response = await mutate<{ _id: string }>("/users/me/password", "PATCH", {
      oldPassword: rawData.oldPassword,
      newPassword: rawData.newPassword,
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

    rawData.oldPassword = "";
    rawData.newPassword = "";
    rawData.confirmPassword = "";
    // Return success state with a success message
    return generateState({}, undefined, "New password saved successfully!");
  } catch (e) {
    console.error("PERFORMER CREATION ERROR: ", e);
    return generateState({}, "An unexpected error occurred.");
  }
}
