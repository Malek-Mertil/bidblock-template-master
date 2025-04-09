/**
 * Interface representing a Category document.
 * This interface defines the fields for managing event categories.
 */
export interface ICategory {
  /** The unique identifier (MongoDB ObjectId) of the document */
  _id: string;

  /** The name of the category */
  name: string;

  /** The URL-friendly slug for the category */
  slug: string;
}
