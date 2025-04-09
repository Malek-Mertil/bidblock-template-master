import { Document, Schema } from "mongoose";

/**
 * Interface representing a TicketFormat document.
 */
export interface ITicketFormat extends Document {
  /** The unique identifier (MongoDB ObjectId) of the document */
  _id: Schema.Types.ObjectId;
  id: string;

  /** The name of the Ticket Format */
  name: string;
  ticketsCount?: number;

  /** The URL-friendly slug for the category */
  slug: string;

  /** Timestamp for when the Ticket Format was created */
  created_at: Date;

  /** Timestamp for the last update to the Ticket Format */
  updated_at: Date;
}

export interface TicketFormatForm {
  id?: FieldState<string>;
  name: FieldState<string>;

  globalError?: string;
  successMessage?: string;
}
