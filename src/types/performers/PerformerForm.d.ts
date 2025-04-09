export interface PerformerForm {
  id?: FieldState<string>;
  name: FieldState<string>;
  description: FieldState<string | null>;
  image: FieldState<File | null>;
  categories: FieldState<string[]>;
  socialLinks: FieldState<string>;
  globalError?: string;
  successMessage?: string;
}
