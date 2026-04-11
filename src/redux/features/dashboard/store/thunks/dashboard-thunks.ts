import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosClientWithAuth as axiosInstance } from "@/utils/axios";
import { DashboardSummaryData } from "../../models/dashboard-response";

export const fetchDashboardSummaryService = createAsyncThunk(
    "dashboard/fetchSummary",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/api/v1/reports/admin-dashboard-summary");
            return response.data.data as DashboardSummaryData;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch dashboard data");
        }
    }
);
