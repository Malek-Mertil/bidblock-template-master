"use server";
const apiUrl = process.env.BACKEND_API_URL;

export async function facebookLogin(
  prevState: boolean | null,
  formData: { accessToken: string; userID: string }
): Promise<boolean> {
  try {
    // Validate input
    if (!formData.accessToken || !formData.userID) {
      throw Error("Missing required fields");
    }

    // Send POST request with email and password as JSON body
    const response = await fetch(`${apiUrl}/auth/login/facebook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Ensure the body is in JSON format
      },
      body: JSON.stringify({
        accessToken: formData.accessToken,
        userID: formData.userID,
      }),
    });

    console.log("**********************************");
    console.log("**********************************");
    console.log(await response.json());
    console.log("**********************************");
    console.log("**********************************");

    return true;
  } catch (error) {
    console.error("Error in Facebook login:", error);
    return false;
  }
}
