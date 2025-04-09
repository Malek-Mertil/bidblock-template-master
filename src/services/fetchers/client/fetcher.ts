export const fetcher = async <T>(url: string): Promise<T> => {
    try {
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`HTTP error! ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  };
  