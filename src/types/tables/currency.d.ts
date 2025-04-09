/**
 * Interface representing a Currency document.
 */
export interface ICurrency {
  /** The unique identifier (MongoDB ObjectId) of the document */
  _id: string;

  name: string;

  code: string;

  /** The currency symbol (e.g., "$", "€") */
  symbol?: string;

  /** Timestamp for when the currency was created */
  created_at?: Date;

  /** Timestamp for the last update to the currency */
  updated_at?: Date;
}
