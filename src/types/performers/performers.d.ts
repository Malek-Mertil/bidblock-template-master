/** Performer data interface */
export interface IPerformer {
  _id?: string;
  id?: string;

  name?: string;
  slug?: string;
  categories?: {
    _id?: string;
    name?: string;
  }[];
  image?: string;

  ticketmaster_id?: string;
  social_links?: {
    platform?: string;
    url?: string;
  }[];

  tickets?: {
    availableTickets?: number;
    soldTickets?: number;
  };
  events?: {
    totalEvents?: number;
    currentEvents?: number;
  };
  followers?: number;
}

interface ApiPerformerDetails {
  _id: string;
  name: string;
  description?: string;
  categories: {
    _id: string;
    name: string;
  }[];
  image?: string;
  ticketmaster_id: string;
  social_links?: {
    platform: string;
    url: string;
  }[];
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
}
