export interface IVenue {
  _id?: string;
  name?: string;
  description?: string;
  address?: string;
  city?: {
    _id?: string;
    name?: string;
  };
  state?: {
    _id?: string;
    name?: string;
  };
  country?: {
    _id?: string;
    name?: string;
  };
  image?: string;
  capacity?: number;
  ticketmaster_id?: string;
  social_links?: {
    platform?: string;
    url?: string;
  }[];

  tickets?: {
    availableTickets?: number;
    soldTickets?: number;
  };
  
  events?: number;

  createdAt?: string;
  updatedAt?: string;
  slug?: string;
  __v?: number;
}
