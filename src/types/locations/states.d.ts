import { ICountry } from "./countries";

export interface IState {
  _id: string;

  name: string;

  state_code: string;

  country: string | ICountry;
}
