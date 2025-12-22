export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginDTO {
  username?: string;
  email?: string;
  password: string;
}

export interface ResetPasswordDTO {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}
