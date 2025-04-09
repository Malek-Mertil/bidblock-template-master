/**
 * Interface representing a EventType document.
 */
export interface IEventType {
  /** The unique identifier (MongoDB ObjectId) of the document */
  _id: string;

  /** The name of the event type */
  name: string;

  /** The URL-friendly slug for the category */
  slug: string;

  /** Timestamp for when the event type was created */
  created_at: Date;

  /** Timestamp for the last update to the event type */
  updated_at: Date;
}
