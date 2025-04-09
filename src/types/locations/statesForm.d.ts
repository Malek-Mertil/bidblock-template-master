export interface StateForm {
  id?: FieldState<string>;
  name: FieldState<string>;
  stateCode: FieldState<string>;
  country: FieldState<string>;
  globalError?: string;
  successMessage?: string;
}
