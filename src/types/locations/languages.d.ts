/**
 * Interface representing a Language document.
 */
export interface ILanguage {
  /** The unique identifier (MongoDB ObjectId) of the document */
  _id: string;

  /** The language code (e.g., "USD", "EUR") */
  name: string;

  /** The language code (e.g., "USD", "EUR") */
  code: string;

  /** The language code (e.g., "USD", "EUR") */
  countries?: number;

  /** Timestamp for when the language was created */
  created_at?: Date;

  /** Timestamp for the last update to the language */
  updated_at?: Date;
}
