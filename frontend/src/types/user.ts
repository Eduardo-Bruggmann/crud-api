export interface User {
  id: string;
  username: string;
  email: string;
  isPrivate: boolean;
  isAdmin: boolean;
  avatar?: string;
}

export interface UpdateUserDTO {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  avatar?: string;
}
