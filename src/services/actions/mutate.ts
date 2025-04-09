import { getSession } from "@/utils/session";
import { logout } from "./auth";

const apiUrl = process.env.BACKEND_API_URL;

if (!apiUrl) {
  throw new Error("BACKEND_API_URL is not defined in environment variables");
}

export default async function mutate<T>(
  endpoint: string,
  method: "POST" | "PATCH" | "PUT",
  body: Record<string, unknown> | FormData
): Promise<
  | { status: "SUCCESS"; data: T }
  | { status: "VALIDATION-ERROR"; errors: Record<string, string[]> }
  | { status: "NOT-ALLOWED" }
  | { status: "NOT-FOUND" }
  | { status: "GLOBAL-ERROR"; message: string }
> {
  try {
    const JWT = await getSession(); // Fetch the JWT token

    const isFormData = body instanceof FormData;

    const headers: HeadersInit = {
      Authorization: `Bearer ${JWT}`,
    };

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    console.log("----------------------------------------------------------------------");
    console.log("----------------------------------------------------------------------");
    console.log(`${apiUrl}${endpoint}`, {
      method,
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });
    console.log("----------------------------------------------------------------------");
    console.log("----------------------------------------------------------------------");
    console.log("----------------------------------------------------------------------");
    const response = await fetch(`${apiUrl}${endpoint}`, {
      method,
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });

    const responseData = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        await logout();
      }

      if (response.status === 403) {
        return { status: "NOT-ALLOWED" };
      }

      if (response.status === 404) {
        return { status: "NOT-FOUND" };
      }

      if (response.status === 400 && responseData.errors) {
        return { status: "VALIDATION-ERROR", errors: responseData.errors };
      }
      return { status: "GLOBAL-ERROR", message: responseData.message };
    }

    return { status: "SUCCESS", data: responseData as T };
  } catch {
    return { status: "GLOBAL-ERROR", message: "An unexpected error occurred." };
  }
}
