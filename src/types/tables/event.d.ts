import { ICategory } from "./category";
import { ICountry } from "./country";
import { IState } from "./state";
import { IPerformer } from "./performer";
import { IVenue } from "./venue";
import { ITicketType } from "./ticketType";
import { ICurrency } from "./currency";
import { IEventType } from "./eventType";

/**
 * Interface representing an Event document.
 */
export interface IEvent {
  /** The unique identifier (MongoDB ObjectId) of the document */
  _id: string;
  id: string;

  /** The name of the event */
  name: string;

  /** The URL-friendly slug for the event (auto-generated) */
  slug: string;

  /** The description of the event (optional) */
  description?: string;

  /** The event type */
  eventType: string | IEventType;

  /** The categories of the event */
  categories?: ICategory[];

  /** The start date and time of the event */
  startDateTime: string;

  /** Indicates whether the start time is unknown */
  isTimeUnset: boolean;

  /** The end date and time of the event (optional) */
  endDateTime?: string;

  /** The venue of the event */
  venue: string | IVenue;

  country: string | ICountry;

  state?: string | IState;

  city?: string;

  /** The geospatial location (longitude, latitude) */
  location?: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };

  /** The image associated with the event (optional) */
  image?: string;

  /** The performers associated with the event */
  performers?: string[] | IPerformer[];

  /** The ticket types associated with the event */
  ticket_types?: {
    ticketType: string | ITicketType;
    maxPrice: number;
    currency: string | ICurrency;
  }[];

  /** Ticket availability and sales counts */
  tickets: {
    availableTickets: number;
    soldTickets: number;
  };

  /** The status of the event */
  status: string;

  /** The unique identifier for Ticketmaster events (optional) */
  ticketmaster_id?: string;

  /** Creator of the event document (optional) */
  createdBy?: string;

  /** Timestamp for when the event type was created */
  created_at: string;

  /** Timestamp for the last update to the event type */
  updated_at: string;
}

export interface EventStats {
  totalEvents: {
    count: number;
    percentNew: number;
  };
  activeEvents: {
    count: number;
    percentOfTotal: number;
  };
  upcomingEvents: {
    count: number;
    percentOfTotal: number;
  };
  highDemandEvents: {
    count: number;
    percentOfTotal: number;
  };
}
