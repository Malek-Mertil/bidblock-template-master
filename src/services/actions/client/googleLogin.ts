"use server";
const apiUrl = process.env.BACKEND_API_URL;

export async function googleLogin(prevState: boolean | null, formData: { credential: string }): Promise<boolean> {
  try {
    // Validate input
    if (!formData.credential) {
      throw Error("Missing required fields");
    }

    // Send POST request with email and password as JSON body
    const response = await fetch(`${apiUrl}/auth/login/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Ensure the body is in JSON format
      },
      body: JSON.stringify({
        credential: formData.credential,
      }),
    });

    console.log("**********************************");
    console.log("**********************************");
    console.log(await response.json());
    console.log("**********************************");
    console.log("**********************************");

    return true;
  } catch (error) {
    console.error("Error in Google login:", error);
    return false;
  }
}
