import { ApiResponse } from "@/types/search/apiResponse";
import SelectOption from "@/types/selectOptions";
import { GroupBase, OptionsOrGroups } from "react-select";

// Function to load options asynchronously with pagination
export const selectOptionsFetcher = async ({
  endpoint,
  inputValue,
  loadedOptions,
  parent,
  parentValue,
}: {
  endpoint: string;
  inputValue: string;
  parent?: string;
  parentValue?: string;
  loadedOptions: OptionsOrGroups<SelectOption, GroupBase<SelectOption>>;
}): Promise<{ options: SelectOption[]; hasMore: boolean }> => {
  try {
    const response = await fetch(
      `/api/admin/${endpoint}?filter_name_CONTAINS=${inputValue}&currentPage=${loadedOptions.length / 10 + 1}${
        parent && parentValue ? "&filter_" + parent + "Id_EQUALS=" + parentValue : ""
      }&pageSize=50&fields=name,_id&orderBy=name`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch options");
    }

    const data: ApiResponse<{ _id: string; name: string }> = await response.json();

    const options =
      data.results?.map((item) => ({
        label: item.name, // Use the `name` field as the label
        value: item._id, // Use the `_id` field as the value
      })) || [];
    // Determine if there are more pages to load
    const hasMore = data.pagination ? data.pagination.page < data.pagination.totalPages : false;

    return { options, hasMore };
  } catch (err) {
    console.error("Error fetching options:", err);
    return {
      options: [],
      hasMore: false,
    };
  }
};

export const selectDefaultOptionFetcher = async ({
  endpoint,
  id,
}: {
  endpoint: string;
  id: string | null;
}): Promise<SelectOption | null> => {
  try {
    if (endpoint && id) {
      const response = await fetch(`/api/admin/${endpoint}/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch options");
      }

      const data = await response.json();

      // Transform the backend data into the format expected by the select component.
      const transformedData = {
        label: data.name, // Use the 'name' field as the label.
        value: data._id, // Use the '_id' field as the value.
      };
      return transformedData;
    }
    return null;
  } catch (err) {
    console.error("Error fetching default option:", err);
    return null;
  }
};

export const selectDefaultOptionsFetcher = async ({
  endpoint,
  ids,
}: {
  endpoint: string;
  ids: string[] | null;
}): Promise<SelectOption[]> => {
  try {
    if (endpoint && ids && ids.length) {
      const response = await fetch(`/api/admin/${endpoint}?filter_id_IN=${ids.join(",")}&pageSize=50`);

      if (!response.ok) {
        throw new Error("Failed to fetch options");
      }

      const data: ApiResponse<{ _id: string; name: string }> = await response.json();

      const options =
        data.results?.map((item) => ({
          label: item.name, // Use the `name` field as the label
          value: item._id, // Use the `_id` field as the value
        })) || [];

      return options;
    }
    return [];
  } catch (err) {
    console.error("Error fetching default option:", err);
    return [];
  }
};
