/**
 * Interface representing a TicketType document.
 */
export interface ITicketType {
  /** The unique identifier (MongoDB ObjectId) of the document */
  _id: string;

  /** The name of the ticket type */
  name: string;

  ticketsCount?: number;

  /** The URL-friendly slug for the category */
  slug: string;

  /** Timestamp for when the ticket type was created */
  created_at: Date;

  /** Timestamp for the last update to the ticket type */
  updated_at: Date;
}

export interface TicketTypeForm {
  id?: FieldState<string>;
  name: FieldState<string>;

  globalError?: string;
  successMessage?: string;
}
