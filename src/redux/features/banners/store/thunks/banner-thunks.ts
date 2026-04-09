import { axiosClientWithAuth } from "@/utils/axios";
import { createApiThunk } from "@/utils/axios/apiWrapper";
import { BannerModel, BannerSearchResponse } from "../models/response/banner-response";

export const fetchAllBannersService = createApiThunk<BannerSearchResponse, any>(
  "banners/fetchAll",
  async (params) => {
    const response = await axiosClientWithAuth.post("/api/v1/admin/banners/search", params);
    const result = response.data.data;
    if (result && result.data && result.data.content) {
      return result.data;
    }
    return result;
  }

);

export const createBannerService = createApiThunk<BannerModel, any>(
  "banners/create",
  async (bannerData) => {
    const response = await axiosClientWithAuth.post("/api/v1/admin/banners", bannerData);
    const result = response.data.data;
    if (result && result.data) {
      return result.data;
    }
    return result;
  }
);

export const updateBannerService = createApiThunk<BannerModel, { id: number; data: any }>(
  "banners/update",
  async ({ id, data }) => {
    const response = await axiosClientWithAuth.put(`/api/v1/admin/banners/${id}`, data);
    const result = response.data.data;
    if (result && result.data) {
      return result.data;
    }
    return result;
  }
);

export const deleteBannerService = createApiThunk<number, number>(
  "banners/delete",
  async (id) => {
    await axiosClientWithAuth.delete(`/api/v1/admin/banners/${id}`);
    return id;
  }
);

export const fetchBannerByIdService = createApiThunk<BannerModel, number>(
  "banners/fetchById",
  async (id) => {
    const response = await axiosClientWithAuth.get(`/api/v1/admin/banners/${id}`);
    const result = response.data.data;
    if (result && result.data) {
      return result.data;
    }
    return result;
  }
);
