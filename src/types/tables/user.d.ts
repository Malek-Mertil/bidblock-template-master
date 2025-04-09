/**
 * Interface representing the JWT payload.
 */
export interface JwtPayload {
  _id: string; // User ID
}

/**
 * Interface representing a User Account document.
 * This interface defines the core fields related to authentication and role management.
 */
export interface IUserAccount {
  /** The unique identifier (MongoDB ObjectId) of the document */
  _id: string;

  /** The unique email address for the user (used for authentication) */
  email: string;

  /** The user's password (only required for traditional authentication) */
  password?: string;

  /** Facebook login ID, if using Facebook authentication */
  facebook_id?: string;

  /** Google login ID, if using Google authentication */
  google_id?: string;

  /** Apple login ID, if using Apple authentication */
  apple_id?: string;

  /** Account status, could represent active, inactive, pending states, etc. */
  status: string;

  /** The user's role, such as ADMIN, BUYER, SELLER */
  role: string[];

  /** Timestamp for when the user account was created */
  created_at: Date;

  /** Timestamp for the last update to the user account */
  updated_at: Date;

  /** Count of how many times the user has logged in */
  loginCount: number;
}

export interface UserStats {
  totalUsers: {
    count: number;
    percentNew: number;
  };
  activeUsers: {
    count: number;
    percentOfTotal: number;
  };
  socialLogins: {
    count: number;
    percentOfTotal: number;
  };
  pendingOrBanned: {
    count: number;
    percentOfTotal: number;
  };
  topLocation?: {
    country: Types.ObjectId | null;
    count: number;
    percentOfTotal: number;
  };
}
