import { ICountry } from "./country";

/**
 * Interface representing a State document.
 * This interface defines the fields for managing state data.
 */
export interface IState {
  /** The unique identifier (MongoDB ObjectId) of the document */
  _id: string;
  id?: string;

  /** The name of the state */
  name: string;

  /** The state code */
  state_code: string;

  /** The country this state belongs to */
  country:
    | {
        _id: string;
        name: string;
        iso2: string;
        iso3: string;
        flag: string;
        phoneCode?: string;
        languages?: Array<{ _id: string; code: string; name: string }>;
      }
    | ICountry;
}
