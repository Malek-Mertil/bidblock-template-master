import { FieldState } from "../form/fieldState";

export interface VenueForm {
  id?: FieldState<string>;
  name: FieldState<string>;
  description: FieldState<string>;
  address: FieldState<string>;
  city: FieldState<string>;
  state: FieldState<string>;
  country: FieldState<string>;
  image: FieldState<File | null>;
  capacity: FieldState<number>;
  socialLinks: FieldState<string>;
  globalError?: string;
  successMessage?: string;
}
