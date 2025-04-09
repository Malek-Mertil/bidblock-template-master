/**
 * Interface representing a Metadata document.
 * This interface defines the fields for storing general configuration data.
 */
export interface IMetadata {
  /** The unique identifier (MongoDB ObjectId) of the document */
  _id: strinng;

  /** The key identifying the configuration (e.g., 'api_call_interval', 'max_tickets') */
  key: string;

  /** The value of the configuration (stringified, could be any type) */
  value: string;

  /** Timestamps for the metadata document */
  createdAt?: Date;
  updatedAt?: Date;
}
