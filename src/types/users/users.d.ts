export interface EditInfoForm {
  name: FieldState<string>;
  email: FieldState<string>;
  gender: FieldState<string>;
  dateOfBirth: FieldState<string>;
  phoneNumber: FieldState<string>;
  language: FieldState<string>;

  globalError?: string;
  successMessage?: string;
}

export interface EditAddressForm {
  city: FieldState<string>;
  state: FieldState<string>;
  country: FieldState<string>;

  globalError?: string;
  successMessage?: string;
}



export interface ChangePasswordForm {
  oldPassword: FieldState<string>;
  newPassword: FieldState<string>;
  confirmPassword: FieldState<string>;

  globalError?: string;
  successMessage?: string;
}


export interface IUser {
  /** The unique identifier (MongoDB ObjectId) of the document */
  _id: string;

  /** The unique email address for the user (used for authentication) */
  email: string;

  /** The user's password (only required for traditional authentication) */
  password?: string;

  /** Facebook login ID, if using Facebook authentication */
  facebook_id?: string;

  /** Google login ID, if using Google authentication */
  google_id?: string;

  /** Apple login ID, if using Apple authentication */
  apple_id?: string;

  /** Account status, could represent active, inactive, pending states, etc. */
  status: string;

  /** The user's role, such as ADMIN, BUYER, SELLER */
  role: string[];

  /** Timestamp for when the user account was created */
  created_at: Date;

  /** Timestamp for the last update to the user account */
  updated_at: Date;

  /** Count of how many times the user has logged in */
  loginCount: number;
}
