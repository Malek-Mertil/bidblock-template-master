"use server";

import * as CryptoJS from "crypto-js";
import { cookies } from "next/headers";

// Secret key for encryption and decryption
const SECRET_KEY: string = process.env.SECRET_KEY || "your-secret-key";

// Encrypt a string
async function encrypt(data: string) {
  try {
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
  } catch (error) {
    console.error("Encryption error:", (error as Error).message);
    return ""; // Return an empty string on error
  }
}

// Decrypt a string
async function decrypt(encryptedData: string) {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || ""; // Return decrypted string or empty if result is invalid
  } catch (error) {
    console.error("Decryption error:", (error as Error).message);
    return ""; // Return an empty string on error
  }
}
// Function to create a session by encrypting the payload and storing it in a cookie
async function createSession(payload: string) {
  // Retrieve the cookie store (used to set and manage cookies)
  const cookieStore = await cookies();

  // Encrypt the payload (likely a JWT or user data)
  const encrypted = await encrypt(payload);

  // If encryption fails (i.e., empty result), throw an error
  if (encrypted.length < 1) {
    throw new Error("Error while encrypting token");
  }

  // Set the encrypted session in a secure, HttpOnly cookie
  cookieStore.set("session", encrypted, {
    httpOnly: true, // Cookie is not accessible via JavaScript (prevents XSS)
    secure: true, // Cookie is only sent over HTTPS (prevents man-in-the-middle attacks)
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Cookie expires in 7 days
    sameSite: "lax", // Allows the cookie to be sent in cross-origin requests, but only for top-level navigation
    path: "/", // The cookie is available to the entire site
  });
}

// Function to retrieve the session (decrypting the stored token)
async function getSession() {
  // Retrieve the cookie store
  const cookieStore = await cookies();

  // Get the "session" cookie value
  const session = cookieStore.get("session")?.value;

  // If a session exists, decrypt it and return the user data
  if (session) {
    return await decrypt(session);
  }
  // If no session exists, implicitly return undefined (i.e., no user found)
  return "";
}

// Function to delete the session cookie
async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export { createSession, getSession, deleteSession, encrypt, decrypt };
