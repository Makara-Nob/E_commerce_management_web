/**
 * User Response Models - Redux Features
 * STRICT ALIGNMENT with Backend (User.ts)
 */

export interface AllUserResponse {
  content: UserModel[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface UserModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  username: string; // backend: username
  email: string;
  fullName: string; // backend: fullName
  phone: string; // backend: phone
  profileUrl: string; // backend: profileUrl
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED"; // backend: status
  userPermission?: "APPROVED" | "PENDING" | "REJECTED" | "NORMAL"; // backend: userPermission
  roles: ("ADMIN" | "STAFF" | "CUSTOMER")[]; // backend: roles
  position?: string;
  address?: string;
  notes?: string;
  telegramNotificationsEnabled?: boolean;
  hasTelegramLinked?: boolean;
  businessId?: string;
  businessName?: string;
}
