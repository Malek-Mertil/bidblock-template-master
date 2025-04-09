import { IState } from "./state";
import { ICountry } from "./country";

/**
 * Interface representing a Venue document.
 * This interface defines the fields for managing venue data.
 */
export interface IVenue extends Document {
  /** The unique identifier (MongoDB ObjectId) of the document */
  _id: string;
  id: string;

  /** The name of the venue */
  name: string;

  /** The description of the venue (optional) */
  description?: string;

  /** The URL-friendly slug for the venue */
  slug: string;

  /** The address of the venue (optional) */
  address?: string;

  /** The city where the venue is located (optional) */
  city?: string;

  /** The state where the venue is located (optional, reference to State model) */
  state?: string | IState;

  /** The country where the venue is located (reference to Country model) */
  country: string | ICountry;

  /** The image associated with the venue (optional) */
  image?: string;

  /** The geospatial location (longitude, latitude) */
  location?: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };

  /** The seating capacity of the venue (optional) */
  capacity?: number;

  /** The unique identifier for Ticketmaster events (optional) */
  ticketmaster_id?: string;

  /** Social media links for the venue (optional) */
  social_links?: {
    platform: string;
    url: string;
  }[];

  /** Ticket counts for the venue */
  tickets: {
    availableTickets: number;
    soldTickets: number;
  };

  /** Event counts for the venue */
  events: {
    totalEvents: number;
    currentEvents: number;
  };
}

export interface VenueStats {
  totalVenues: {
    count: number;
    percentNew: number;
  };
  activeVenues: {
    count: number;
    percentOfTotal: number;
  };
  topLocation: {
    state?: string;
    city?: string;
    count: number;
    percentOfTotal: number;
  };
  popularVenues: {
    count: number;
    percentOfTotal: number;
  };
}
