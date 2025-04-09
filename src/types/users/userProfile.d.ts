import { ICountry } from "../locations/countries";
import { ILanguage } from "../locations/languages";
import { IState } from "../locations/states";
import { IUser } from "./users";

export interface IUserProfile {
  /** The unique identifier (MongoDB ObjectId) of the document */
  _id: string;

  /** Reference to the associated User account */
  account: IUser;

  /** User's full name */
  name: string;

  /** The URL-friendly slug for the user profile */
  slug: string;

  /** User's Gender*/
  gender?: string;

  /** User's phone number */
  phone_number?: string;

  /** Reference to the associated State */
  state?: IState;

  /** Reference to the associated Country */
  country?: ICountry;

  image?: string;

  /** User's City */
  city?: string;

  /** User's Birth date */
  date_of_birth?: Date;

  /** User's pref language */
  language?: ILanguage;

  createdAt: string;
  updatedAt: string;
}
