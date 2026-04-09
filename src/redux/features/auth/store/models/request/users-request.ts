/**
 * User Request Models - Redux Features
 * STRICT ALIGNMENT with Backend (User.ts)
 */

export interface CreateUserRequest {
  username: string; // backend: username
  email: string;
  password: string;
  fullName: string; // backend: fullName
  phone: string; // backend: phone
  profileUrl?: string; // backend: profileUrl
  roles: string[];
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED"; // backend: status
  position?: string;
  address?: string;
  notes?: string;
  businessId?: string;
}

export interface UpdateUserRequest {
  id?: string;
  fullName?: string; // backend: fullName
  phone?: string; // backend: phone
  profileUrl?: string; // backend: profileUrl
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED"; // backend: status
  roles?: string[];
  position?: string;
  address?: string;
  notes?: string;
  businessId?: string;
}

export interface AllUserRequest {
  search?: string;
  status?: string; // backend: const status = body.status || '';
  pageNo?: number;
  pageSize?: number;
}

export interface AdminResetPasswordRequest {
  userId: string | number;
  newPassword: string;
}

export interface UpdateUserParams {
  userId: string;
  userData: UpdateUserRequest;
}
