export type UserRole = 'SUPER_ADMIN' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'BLOCKED';

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  companyName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUserFormValues {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  companyName?: string;
  status: UserStatus;
}

export interface UserResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
}

export interface IUserProfile {
  id: string;
  name: string;
  email: string;
  companyName?: string;
  profilePhoto?: string;
  role: UserRole;
}

export interface UpdateProfilePayload {
  name?: string;
  companyName?: string;
  profilePhoto?: string;
}

export interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthSession {
  token: string;
  user: IUserProfile;
}

export interface LoginResponseData {
  token: string;
  user: IUserProfile;
}

export const ROLES: Record<string, UserRole> = {
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
};

export const ADMIN_ROLES: readonly UserRole[] = [ROLES.ADMIN, ROLES.SUPER_ADMIN];

export const SUPER_ADMIN_ROLES: readonly UserRole[] = [ROLES.SUPER_ADMIN];

export interface AuthenticatedUser {
  id: string;
  role?: UserRole;
  status?: UserStatus;
}
