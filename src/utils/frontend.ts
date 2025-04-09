"use client";

import { format, formatDistanceToNow } from 'date-fns';


export const getImageFileFromURL = async (imageUrl: string) => {
  try {
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const contentType = response.headers.get("Content-Type") || blob.type || "image/jpeg";
    const fileExtension = contentType.startsWith("image/") ? contentType.split("/")[1] : "jpeg";

    // Get filename from URL
    let filename = "image"; // Default filename
    try {
      const url = new URL(imageUrl);
      const pathname = url.pathname;
      const filenameFromPath = pathname.substring(pathname.lastIndexOf("/") + 1);
      if (filenameFromPath) {
        filename = filenameFromPath.split("?")[0]; // Remove query parameters from filename
      }
    } catch (error) {
      console.warn("Could not parse URL for filename:", error);
    }
    const actualFilename = filename.includes(".") ? filename : `${filename}.${fileExtension}`;

    const file = new File([blob], actualFilename, {
      type: contentType,
    });

    return file;
  } catch (error) {
    console.error("Error fetching or creating image file:", error);
    return null;
  }
};


/**
 * Utility function for formatting dates and times (without time zone support).
 *
 * @param dateString The date/time string in ISO 8601 format (e.g., "2025-03-08T06:30:00.000Z").
 * @param formatString The date-fns format string (see date-fns docs for options). If not provided, a default localized format is used.
 * @param relativeTime If true, returns a relative time (e.g., "in 3 days"). Overrides formatString.
 * @returns The formatted date/time string, or null if the date is invalid.
 */
export const formatDate = (
  dateString: string,
  formatString?: string,
  relativeTime?: boolean
): string | null => {
  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) { // Check for invalid date
      return null;
    }

    if (relativeTime) {
      return formatDistanceToNow(date, { addSuffix: true });
    }

    return format(date, formatString || 'MMMM d, yyyy, h:mm a'); // Default localized format
  } catch (error) {
    console.error("Error formatting date:", error);
    return null; // Or handle the error as you see fit
  }
};