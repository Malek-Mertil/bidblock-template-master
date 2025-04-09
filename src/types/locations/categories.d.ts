import { FieldState } from "../form/fieldState";

export interface CategoryForm {
  id?: FieldState<string>;
  name: FieldState<string>;

  globalError?: string;
  successMessage?: string;
}

/**
 * Interface representing a Category document.
 */
export interface ICategory {
  _id: string;

  /** The name of the event type */
  name: string;

  /** The URL-friendly slug for the category */
  slug: string;

  performers?: number;
  performersCount?: number;

  events?: number;
  eventsCount?: number;

  /** Timestamp for when the event type was created */
  created_at: Date;

  /** Timestamp for the last update to the event type */
  updated_at: Date;
}
