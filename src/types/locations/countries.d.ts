import { ICurrency } from "../currencies/curencies";
import { ILanguage } from "./languages";

/**
 * Interface representing a Country document.
 * This interface defines the fields for managing country data.
 */
export interface ICountry {
  /** The unique identifier (MongoDB ObjectId) of the document */
  _id: string;

  /** The name of the country */
  name: string;

  /** The ISO 2 country code (2 letters) */
  iso2: string;

  /** The ISO 3 country code (3 letters) */
  iso3: string;

  /** The country's currency (references the Currency model) */
  currency: string | ICurrency; // Reference to Currency model

  /** The country's flag image [URL] (optional) */
  flag?: string;

  /** The international phone code for the country (optional) */
  phoneCode?: string;

  /** The languages spoken in the country (optional, array of objects with code and name) */
  languages?: string[] | ILanguage[];

  /** Google Map information for the country (optional) */
  googleMapInfo?: {
    lat: number;
    lng: number;
    zoom: number;
  };
}
