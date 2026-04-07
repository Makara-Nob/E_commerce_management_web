import { LoginCredentials } from "@/models/auth/auth.request";
import { UserAuthResponse } from "@/models/auth/auth.response";
import { axiosClient, axiosClientWithAuth } from "@/utils/axios";
import { storeRoles } from "@/utils/local-storage/roles";
import { storeToken } from "@/utils/local-storage/token";
import { storeUserInfo } from "@/utils/local-storage/userInfo";

export async function loginService(credentials: LoginCredentials) {
  try {
    const response = await axiosClient.post("/api/v1/auth/login", credentials);

    const apiResponse = response.data.data;
    const { token, user } = apiResponse;

    const userData = {
      accessToken: token,
      userId: user.id.toString(),
      userIdentifier: user.username,
      email: user.email,
      fullName: user.fullName,
      userType: user.role,
      roles: user.roles,
    };

    storeToken(userData.accessToken);
    storeUserInfo({
      userId: userData.userId,
      userIdentifier: userData.userIdentifier,
      profileImageUrl: "", // Missing from new API response
      email: userData.email,
      fullName: userData.fullName,
      businessId: "", // Missing from new API response
      userType: userData.userType,
    });
    storeRoles(userData.roles);

    return userData;
  } catch (error) {
    console.error("Login service error:", error);
    throw {
      errorMessage: "An unexpected error occurred during login.",
      rawError: error,
    };
  }
}

export async function getProfileService() {
  try {
    const response = await axiosClientWithAuth.get("/api/v1/user/profile");
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Get profile service error:", error);
    throw error;
  }
}
