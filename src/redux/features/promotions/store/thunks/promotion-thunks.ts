import { axiosClientWithAuth } from "@/utils/axios";
import { createApiThunk } from "@/utils/axios/apiWrapper";
import { PromotionModel, PromotionSearchResponse } from "../models/response/promotion-response";

export const fetchAllPromotionsService = createApiThunk<PromotionSearchResponse, any>(
  "promotions/fetchAll",
  async (params) => {
    const response = await axiosClientWithAuth.post("/api/v1/admin/promotions/fetch", params);
    const result = response.data.data;
    if (result && result.data && result.data.content) {
      return result.data;
    }
    return result;
  }
);

export const createPromotionService = createApiThunk<PromotionModel, any>(
  "promotions/create",
  async (promotionData) => {
    const response = await axiosClientWithAuth.post("/api/v1/admin/promotions", promotionData);
    const result = response.data.data;
    if (result && result.data) {
      return result.data;
    }
    return result;
  }
);

export const updatePromotionService = createApiThunk<PromotionModel, { id: number; data: any }>(
  "promotions/update",
  async ({ id, data }) => {
    const response = await axiosClientWithAuth.put(`/api/v1/admin/promotions/${id}`, data);
    const result = response.data.data;
    if (result && result.data) {
      return result.data;
    }
    return result;
  }
);

export const deletePromotionService = createApiThunk<number, number>(
  "promotions/delete",
  async (id) => {
    await axiosClientWithAuth.delete(`/api/v1/admin/promotions/${id}`);
    return id;
  }
);
