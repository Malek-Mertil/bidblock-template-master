"use server";

import { LoginFormSchema } from "@/utils/rules";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createSession } from "@/utils/session";
import { LoginForm } from "@/types/auth/loginForm";

const apiUrl = process.env.BACKEND_API_URL;

export async function login(state: LoginForm, formData: FormData) {
  let newState = state;

  try {
    // Get form data as a plain object
    const formValues = Object.fromEntries(formData.entries());

    // Validate form fields using LoginFormSchema
    const validatedFields = LoginFormSchema.safeParse({
      email: formValues.email,
      password: formValues.password,
    });

    // Create a new state by merging the existing state with formData values
    newState = {
      email: {
        value: formValues.email.toString() ?? state.email?.value, // Use form data or keep previous state value
        errors: [],
      },
      password: {
        value: formValues.password.toString() ?? state.password?.value, // Use form data or keep previous state value
        errors: [],
      },
    };

    if (!validatedFields.success) {
      const errors = validatedFields.error.flatten().fieldErrors;

      // Update errors based on validation results
      newState.email.errors = errors?.email || [];
      newState.password.errors = errors?.password || [];

      throw new Error("Validation failed");
    }

    // Send POST request with email and password as JSON body
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Ensure the body is in JSON format
      },
      body: JSON.stringify({
        email: formValues.email,
        password: formValues.password,
      }),
    });

    // Handle the response
    if (!response.ok) {
      newState.globalError = "Invalid email or password.";
      throw new Error("Login failed: " + (await response.text()));
    }

    const jsonResp = await response.json();

    if (!jsonResp) {
      throw new Error("cannot retrieve JSON from response");
    }

    await createSession(jsonResp.token);
  } catch (e) {
    if (e instanceof Error) {
      console.error("LOGIN ERROR: ", e.message);
    } else {
      console.error("LOGIN ERROR: ", e);
    }
    return newState;
  }

  // Need  to put Redirect outside try-catch
  redirect("/admin/dashboard");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/admin/login");
}
