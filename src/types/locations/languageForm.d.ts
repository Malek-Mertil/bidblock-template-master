import { FieldState } from "../form/fieldState";

export interface LanguageForm {
  id?: FieldState<string>;
  name: FieldState<string>;
  code: FieldState<string>;

  globalError?: string;
  successMessage?: string;
}
