"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { UserForm } from "@/types/users/userForm";
import { UserRole } from "@/enums/UserRole";
import { UserStatus } from "@/enums/UserStatus";
import mutate from "../mutate";

const passwordValidation = {
  password: z
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
};
const userValidation = {
  email: z.string().min(1, "Email is required").max(100, "Email must not exceed 100 characters").email(),

  name: z.string().min(2, "Name must contain atleast 6 characters").max(100, "Name must not exceed 100 characters"),

  role: z
    .string()
    .min(1, "Role is required")
    .max(100, "Role must not exceed 100 characters")
    .refine((value) => {
      const roles = value.split(",");
      const validRoles = new Set<string>(Object.values(UserRole) as string[]);
      return roles.every((role) => validRoles.has(role));
    }, "Invalid Role"),

  status: z
    .string()
    .min(1, "Status is required")
    .max(100, "Status must not exceed 100 characters")
    .refine((value) => {
      const validStatuses = new Set<string>(Object.values(UserStatus) as string[]);
      return validStatuses.has(value);
    }, "Invalid Status"),

  phoneNumber: z.string().optional(),

  gender: z.string().optional(),

  city: z.string().optional(),

  state: z
    .string()
    .max(50, { message: "State cannot exceed 50 characters" })

    .optional(),

  country: z
    .string()
    .max(50, { message: "Country cannot exceed 50 characters" })

    .optional(),

  language: z
    .string()
    .max(50, { message: "Language cannot exceed 50 characters" })

    .optional(),

  dateOfBirth: z.string().datetime({ message: "Date of birth must be a valid ISO 8601 date" }).nullable().optional(),
};

export async function postUser(state: UserForm, formData: FormData): Promise<UserForm> {
  // Extract form data
  const rawData = {
    id: formData.get("id") as string,
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    image: formData.get("image") as File | null,
    password: formData.get("password") as string,
    role: formData.get("role") as string,
    status: formData.get("status") as string,
    phoneNumber: formData.get("phoneNumber") as string,
    city: formData.get("city") as string,
    state: formData.get("state") as string,
    country: formData.get("country") as string,
    gender: formData.get("gender") as string,
    dateOfBirth: formData.get("dateOfBirth") as string,
    language: formData.get("language") as string,
  };
  console.log("rawData === >>", rawData);

  // Helper function to generate the state object
  const generateState = (errors: Record<string, string[]> = {}, globalError?: string, successMessage?: string): UserForm => ({
    id: { value: rawData.id, errors: [] },
    name: { value: rawData.name, errors: errors.name || [] },
    email: { value: rawData.email, errors: errors.email || [] },
    image: { value: rawData.image, errors: errors.image || [] },
    password: { value: rawData.password, errors: errors.password || [] },

    role: { value: rawData.role, errors: errors.role || [] },
    status: { value: rawData.status, errors: errors.status || [] },

    city: { value: rawData.city, errors: errors.city || [] },
    state: { value: rawData.state, errors: errors.state || [] },
    country: { value: rawData.country, errors: errors.country || [] },

    phoneNumber: { value: rawData.phoneNumber, errors: errors.phoneNumber || [] },
    gender: { value: rawData.gender, errors: errors.gender || [] },
    dateOfBirth: { value: rawData.dateOfBirth, errors: errors.dateOfBirth || [] },
    language: { value: rawData.language, errors: errors.language || [] },

    globalError,
    successMessage,
  });
  let id = "";
  try {
    // Validate form data using Zod schema
    let validation = userValidation;
    if (!rawData.id) {
      validation = { ...userValidation, ...passwordValidation };
    }

    const validatedData = z.object(validation).safeParse(rawData);

    // If validation fails, return the state with validation errors
    if (!validatedData.success) {
      const errors = validatedData.error.flatten().fieldErrors;

      console.log("errors === >>", errors);

      return generateState(errors, "Validation failed. Please check the form fields.");
    }

    // Create a new FormData object to send the file
    const uploadFormData = new FormData();

    if (rawData.image) {
      uploadFormData.append("image", rawData.image);
    }

    uploadFormData.append("name", rawData.name);
    uploadFormData.append("email", rawData.email);
    uploadFormData.append("password", rawData.password);
    uploadFormData.append("role", rawData.role);
    uploadFormData.append("status", rawData.status);
    uploadFormData.append("city", rawData.city);
    uploadFormData.append("state", rawData.state);
    uploadFormData.append("country", rawData.country);
    uploadFormData.append("phoneNumber", rawData.phoneNumber);
    uploadFormData.append("gender", rawData.gender);
    uploadFormData.append("dateOfBirth", rawData.dateOfBirth);
    uploadFormData.append("language", rawData.language);

    const response = await mutate<{ _id: string }>(
      `/users${rawData.id ? "/" + rawData.id : ""}`,
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
      return generateState({}, undefined, "User saved successfully!");
    }

    id = response.data._id;
  } catch (e) {
    console.error("User CREATION ERROR: ", e);
    return generateState({}, "An unexpected error occurred.");
  }
  redirect(`/admin/users/manage-users/${id}?save=true`);
}
