import { ICurrency } from "./currency";
import { IUserProfile } from "./userProfile";
import { IEvent } from "./event";
import { ITicketType } from "./ticketType";
import { ITicketFormat } from "./ticketFormat";

/**
 * Interface representing a Ticket document.
 * This interface defines the fields for managing ticket data.
 */
export interface ITicket {
  /** The unique identifier (MongoDB ObjectId) of the document */
  _id: string;

  /** The event associated with the ticket (reference to Event model) */
  event: string | IEvent;

  /** The description of the venue (optional) */
  description?: string;

  /** The seller of the ticket (reference to User model) */
  seller: string | IUserProfile;

  /** The price of the ticket */
  price: number;

  /** The currency of the ticket price */
  currency: string | ICurrency;

  /** The quantity of tickets available */
  quantity: number;

  /** The category of the ticket (VIP, Regular, etc.) */
  ticket_type: string | ITicketType;

  ticket_format: string | ITicketFormat;

  /** The status of the ticket (e.g., 'available', 'sold') */
  status: string;

  /** The expiration date of the ticket (optional) */
  expiration_date?: string;
}

export interface TicketForm {
  id?: FieldState<string>;
  description: FieldState<string>;
  expirationDate: FieldState<string | null>;
  event: FieldState<string>;
  currency: FieldState<string>;
  ticketType: FieldState<string>;
  ticketFormat: FieldState<string>;
  status: FieldState<string>;
  price: FieldState<number>;
  quantity: FieldState<number>;

  globalError?: string;
  successMessage?: string;
}
