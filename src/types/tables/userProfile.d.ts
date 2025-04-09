import { ICountry } from "./country";
import { ILanguage } from "./language";
import { IState } from "./state";
import { IUserAccount } from "./user";

/**
 * Interface representing a User Profile document.
 * This interface extends Document, providing access to MongoDB-specific document features.
 */
export interface IUserProfile extends Document {
  /** The unique identifier (MongoDB ObjectId) of the document */
  _id: string;
  id: string;

  /** Reference to the associated User account */
  account: string | IUserAccount;

  /** User's full name */
  name: string;

  /** User's Image */
  image: string;

  /** The URL-friendly slug for the user profile */
  slug: string;

  /** User's Gender*/
  gender?: string;

  /** User's phone number */
  phone_number?: string;

  /** Reference to the associated State */
  state?: string | IState;

  /** Reference to the associated Country */
  country?: string | ICountry;

  /** User's City */
  city: string;

  /** User's Birth date */
  date_of_birth: strinng;

  /** User's pref language */
  language: string | ILanguage;
}
