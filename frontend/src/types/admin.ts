export interface CreateUserByAdminDTO {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  isAdmin: boolean;
}

export interface UpdateUserByAdminDTO {
  username?: string;
  isAdmin?: boolean;
  avatar?: string;
}
