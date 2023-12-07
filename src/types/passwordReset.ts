export interface PasswordReset {
  email?: string;
}
export interface PasswordResetVerify {
  plainPassword?: string;
  plainPasswordConfirm?: string;
  passwordChangeToken?: string;
}
