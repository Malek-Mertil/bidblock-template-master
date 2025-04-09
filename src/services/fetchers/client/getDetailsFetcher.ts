import { ApiEventDetails } from "@/types/events/event";

export const getDetails = async ({ endpoint, id }: { endpoint: string; id: string | null }): Promise<ApiEventDetails | null> => {
  try {
    if (endpoint && id) {
      const response = await fetch(`/api/get-details/${endpoint}/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch options");
      }

      return await response.json();
    }
    return null;
  } catch (err) {
    console.error("Error fetching default option:", err);
    return null;
  }
};
