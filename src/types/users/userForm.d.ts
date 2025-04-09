import { FieldState } from "../form/fieldState";

export interface UserForm {
  id?: FieldState<string>;
  email: FieldState<string>;
  image: FieldState<File | null>;
  password: FieldState<string>;
  role: FieldState<string>;
  status: FieldState<string>;
  name: FieldState<string>;
  phoneNumber: FieldState<string>;
  city: FieldState<string>;
  state: FieldState<string>;
  country: FieldState<string>;
  gender: FieldState<string>;
  dateOfBirth: FieldState<string>;
  language: FieldState<string>;

  globalError?: string;
  successMessage?: string;
}
