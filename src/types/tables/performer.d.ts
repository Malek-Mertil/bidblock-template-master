import { ICategory } from "./category";

/** Performer data interface */
export interface IPerformer {
  _id: string;
  id: string;
  name: string;
  slug: string;
  categories: string[] | ICategory[];
  description?: string;
  image?: string;

  ticketmaster_id?: string; // Ticketmaster event ID
  social_links?: {
    platform: string;
    url: string;
  }[];
  tickets: {
    availableTickets: number;
    soldTickets: number;
  };
  events?: number;
  followers: number;
}

export interface PerformerStats {
  totalPerformers: {
    count: number;
    percentNew: number;
  };
  activePerformers: {
    count: number;
    percentOfTotal: number;
  };
  topCategory: {
    category: Schema.Types.ObjectId | null;
    count: number;
    percentOfTotal: number;
  };
  popularPerformers: {
    count: number;
    percentOfTotal: number;
  };
}
