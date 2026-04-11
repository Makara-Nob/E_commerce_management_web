import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DashboardSummaryData } from "../../models/dashboard-response";
import { fetchDashboardSummaryService } from "../thunks/dashboard-thunks";

interface DashboardState {
    data: DashboardSummaryData | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: DashboardState = {
    data: null,
    isLoading: false,
    error: null,
};

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        clearDashboardError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardSummaryService.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchDashboardSummaryService.fulfilled, (state, action: PayloadAction<DashboardSummaryData>) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchDashboardSummaryService.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
