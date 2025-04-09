import { FieldState } from "../form/fieldState";

export interface CountryForm {
  id?: FieldState<string>;
  name: FieldState<string>;
  iso2: FieldState<string>;
  iso3: FieldState<string>;
  flag: FieldState<File | null>;
  currency: FieldState<string>;
  phoneCode: FieldState<string>;
  languages: FieldState<string[]>;
  globalError?: string;
  successMessage?: string;
}
