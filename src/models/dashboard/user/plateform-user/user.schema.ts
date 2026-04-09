import { z } from "zod";

/**
 * User Management - Validation Schema
 * STRICT ALIGNMENT with Backend (User.ts)
 */

// Common fields used in both create and update
const commonFields = {
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(1, "Phone number is required"),
  position: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]),
  roles: z.array(z.string()).min(1, "At least one role is required"),
  notes: z.string().optional().or(z.literal("")),
};

// Create user schema
export const createUserSchema = z.object({
  ...commonFields,
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Update user schema
export const updateUserSchema = z.object({
  ...commonFields,
  id: z.string().min(1, "User ID is required"),
});

// Type exports
export type CreateUserPayload = z.infer<typeof createUserSchema>;
export type UpdateUserPayload = z.infer<typeof updateUserSchema>;

// Combined form data type for the Unified Modal
export type UserFormData = {
  id?: string;
  username?: string;
  email?: string;
  password?: string;
  fullName?: string;
  phone?: string;
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  roles?: string[];
  position?: string;
  address?: string;
  notes?: string;
  profileUrl?: string;
};
