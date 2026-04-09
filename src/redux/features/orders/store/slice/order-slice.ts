import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OrderModel, OrderSearchResponse } from "../models/response/order-response";
import { fetchAllOrdersService, updateOrderStatusService } from "../thunks/order-thunks";

interface OrdersState {
    orders: OrderModel[];
    isLoading: boolean;
    error: string | null;
    pagination: {
        currentPage: number;
        pageSize: number;
        totalElements: number;
        totalPages: number;
        isLast: boolean;
    };
    filters: {
        pageNo: number;
        pageSize: number;
        search: string;
        status: string;
    };
    operations: {
        isUpdating: boolean;
    };
}

const initialState: OrdersState = {
    orders: [],
    isLoading: false,
    error: null,
    pagination: {
        currentPage: 1,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
        isLast: false,
    },
    filters: {
        pageNo: 1,
        pageSize: 10,
        search: "",
        status: "ALL",
    },
    operations: {
        isUpdating: false,
    },
};

const orderSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        setPageNo: (state, action: PayloadAction<number>) => {
            state.filters.pageNo = action.payload;
        },
        setSearchFilter: (state, action: PayloadAction<string>) => {
            state.filters.search = action.payload;
            state.filters.pageNo = 1;
        },
        setStatusFilter: (state, action: PayloadAction<string>) => {
            state.filters.status = action.payload;
            state.filters.pageNo = 1;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch All Orders
            .addCase(fetchAllOrdersService.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAllOrdersService.fulfilled, (state, action: PayloadAction<OrderSearchResponse>) => {
                state.isLoading = false;
                state.orders = action.payload.content;
                state.pagination = {
                    currentPage: action.payload.pageNo,
                    pageSize: action.payload.pageSize,
                    totalElements: action.payload.totalElements,
                    totalPages: action.payload.totalPages,
                    isLast: action.payload.last,
                };
            })
            .addCase(fetchAllOrdersService.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Update Order Status
            .addCase(updateOrderStatusService.pending, (state) => {
                state.operations.isUpdating = true;
                state.error = null;
            })
            .addCase(updateOrderStatusService.fulfilled, (state, action) => {
                state.operations.isUpdating = false;
                // Update local status if found
                const updatedOrder = action.meta.arg;
                const index = state.orders.findIndex(o => o.id === updatedOrder.id);
                if (index !== -1) {
                    state.orders[index].status = updatedOrder.status as any;
                }
            })
            .addCase(updateOrderStatusService.rejected, (state, action) => {
                state.operations.isUpdating = false;
                state.error = action.payload as string;
            });
    },
});

export const { setPageNo, setSearchFilter, setStatusFilter, clearError } = orderSlice.actions;
export default orderSlice.reducer;
