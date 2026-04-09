/**
 * User Management - Async Thunks
 * STRICT ALIGNMENT with Backend (userController.ts & Router.ts)
 */

import {
  AllUserRequest,
  CreateUserRequest,
  UpdateUserParams,
  AdminResetPasswordRequest,
} from "../models/request/users-request";
import { UserModel } from "../models/response/users-response";
import { axiosClientWithAuth } from "@/utils/axios";
import { createApiThunk } from "@/utils/axios/apiWrapper";

/**
 * Fetch all users
 * Backend structure: { data: { data: { content: [...] } } }
 */
export const fetchAllUsersService = createApiThunk<any, AllUserRequest>(
  "users/fetchAll",
  async (params) => {
    const response = await axiosClientWithAuth.post(
      "/api/v1/user",
      params
    );
    // Unwrapping double data layer from backend Router + Controller
    return response.data.data.data; 
  }
);

/**
 * Fetch user by ID
 * Backend structure: { data: { data: { id: ... } } }
 */
export const fetchUserByIdService = createApiThunk<any, string>(
  "users/fetchById",
  async (userId) => {
    const response = await axiosClientWithAuth.post(`/api/v1/user/getById/${userId}`);
    return response.data.data.data;
  }
);

/**
 * Create user
 * Backend structure: { data: { data: { id: ... } } }
 */
export const createUserService = createApiThunk<any, CreateUserRequest>(
  "users/create",
  async (userData) => {
    const response = await axiosClientWithAuth.post("/api/v1/user/create-user", userData);
    return response.data.data.data;
  }
);

/**
 * Update user
 * Backend structure: { data: { data: { id: ... } } }
 */
export const updateUserService = createApiThunk<any, UpdateUserParams>(
  "users/update",
  async ({ userId, userData }) => {
    const response = await axiosClientWithAuth.post(
      `/api/v1/user/updateById/${userId}`,
      userData
    );
    return response.data.data.data;
  }
);

/**
 * Delete user
 * Backend structure: { data: { data: { id: ... } } }
 */
export const deleteUserService = createApiThunk<any, string>(
  "users/delete",
  async (userId) => {
    const response = await axiosClientWithAuth.post(
      `/api/v1/user/deleteById/${userId}`
    );
    // backend delete returns { message, data: { id } }
    return response.data.data.id;
  }
);

/**
 * Toggle user status (Active/Inactive)
 */
export const toggleUserStatusService = createApiThunk<any, UserModel>(
  "users/toggleStatus",
  async (user) => {
    if (!user?.id) {
      throw new Error("User ID is required");
    }

    const newStatus =
      user?.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    const response = await axiosClientWithAuth.post(`/api/v1/user/updateById/${user.id}`, {
      status: newStatus,
    });
    return response.data.data.data;
  }
);

/**
 * Reset user password (by Admin)
 * Backend structure: { data: { data: { id: ... } } }
 */
export const resetUserPasswordService = createApiThunk<any, AdminResetPasswordRequest>(
  "users/resetPassword",
  async (request) => {
    const response = await axiosClientWithAuth.post(
      "/api/v1/user/change-password-by-admin",
      request
    );
    return response.data.data.data;
  }
);
