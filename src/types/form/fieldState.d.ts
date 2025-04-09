export interface FieldState<T = unknown> {
  value?: T;
  errors: string[] | undefined;
}
