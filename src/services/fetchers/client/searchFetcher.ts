interface ApiResponse<T> {
  results: T[];
  pagination: {
    total: number;
  };
}

export const searchFetcher = async <T>(url: string): Promise<{ rows: T[]; totalRows: number }> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const resp: ApiResponse<T> = await response.json();
    return {
      rows: resp?.results || [],
      totalRows: resp?.pagination?.total || 0,
    };
  } catch (error) {
    console.error("Fetch error:", error);
    return { rows: [], totalRows: 0 };
  }
};
