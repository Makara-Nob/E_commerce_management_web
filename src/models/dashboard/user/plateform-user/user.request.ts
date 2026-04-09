export interface AllUserRequest {
  search?: string;
  status?: string[];
  roles?: string[];
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: string;
}

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
  id: string;
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

export interface ChangePasswordByAdminModel {
  userId: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordModel {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
