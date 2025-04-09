// app/types/eventForm.ts

import { FieldState } from "../form/fieldState";

export interface EventForm {
  id?: FieldState<string>;
  name: FieldState<string>;
  image: FieldState<File | null>;
  startDateTime: FieldState<string | null>;
  isTimeUnset: FieldState<string | null>;
  endDateTime: FieldState<string | null>;
  venue: FieldState<string>;
  performers: FieldState<string[]>;
  description: FieldState<string>;
  ticketTypes: FieldState<string>;
  categories: FieldState<string[]>;
  eventType: FieldState<string>;
  globalError?: string;
  successMessage?: string;
}
export interface ApiResponse {
  results?: IEvent[];
  pagination?: Pagination;
}

export interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiEventDetails {
  _id: string;
  name: string;
  description: string;
  categories: {
    _id: string;
    name: string;
  }[];
  eventType: {
    _id: string;
    name: string;
  };
  startDateTime: string;
  endDateTime?: string;
  isTimeUnset: boolean;
  venue: {
    _id: string;
    name: string;
    description: string;
    state: {
      _id: string;
      name: string;
    };
    country: {
      _id: string;
      name: string;
    };
    image: {
      url: string;
      alt_text: string;
    };
    location: {
      coordinates: number[];
    };
    capacity: number;
    social_links: {
      platform: string;
      url: string;
    }[];
    createdAt: string;
    updatedAt: string;
    slug: string;
  };
  image?: string;
  performers: {
    _id: string;
    name: string;
    categories: {
      _id: string;
      name: string;
    }[];
    image: {
      url: string;
      alt_text: string;
    };
    ticketmaster_id: string;
    social_links: {
      platform: string;
      url: string;
    }[];
  }[];
  ticket_types: {
    ticketType: { name: string; _id: string };
    maxPrice: number;
    currency: {
      _id: string;
      code: string;
      symbol: string;
      created_at: string;
      updated_at: string;
    };
    _id: string;
  }[];
  tickets: {
    availableTickets: number;
    soldTickets: number;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    _id: string;
    name: string;
  };
  likes?: number;
  slug: string;
}
