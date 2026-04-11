import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosClientWithAuth as axiosInstance } from "@/utils/axios";
import { OrderSearchResponse } from "../models/response/order-response";

interface FetchOrdersParams {
    pageNo: number;
    pageSize: number;
    search?: string;
    status?: string;
}

export const fetchAllOrdersService = createAsyncThunk(
    "orders/fetchAll",
    async (params: FetchOrdersParams, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/api/v1/admin/orders/fetch", params);
            return response.data.data as OrderSearchResponse;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
        }
    }
);

interface UpdateOrderStatusParams {
    id: number;
    status: string;
}

export const updateOrderStatusService = createAsyncThunk(
    "orders/updateStatus",
    async ({ id, status }: UpdateOrderStatusParams, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/api/v1/admin/orders/${id}/status`, { status });
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to update order status");
        }
    }
);
