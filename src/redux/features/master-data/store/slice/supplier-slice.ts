import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchAllSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../thunks/supplier-thunks";
import { SupplierManagementState } from "../models/supplier-types";

const initialState: SupplierManagementState = {
  data: null,
  isLoading: false,
  error: null,
  filters: {
    search: "",
    pageNo: 1,
  },
  operations: {
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
  },
};

const supplierSlice = createSlice({
  name: "suppliers",
  initialState,
  reducers: {
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
      state.filters.pageNo = 1;
    },
    setPageNo: (state, action: PayloadAction<number>) => {
      state.filters.pageNo = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<string | undefined>) => {
      state.filters.status = action.payload;
      state.filters.pageNo = 1;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch all suppliers
    builder
      .addCase(fetchAllSuppliers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllSuppliers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchAllSuppliers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create supplier
    builder
      .addCase(createSupplier.pending, (state) => {
        state.operations.isCreating = true;
        state.error = null;
      })
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.operations.isCreating = false;
        if (state.data) {
          state.data.content = [action.payload, ...state.data.content];
          state.data.totalElements += 1;
        }
      })
      .addCase(createSupplier.rejected, (state, action) => {
        state.operations.isCreating = false;
        state.error = action.payload as string;
      });

    // Update supplier
    builder
      .addCase(updateSupplier.pending, (state) => {
        state.operations.isUpdating = true;
        state.error = null;
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        state.operations.isUpdating = false;
        if (state.data) {
          state.data.content = state.data.content.map((supplier) =>
            supplier.id === action.payload.id ? action.payload : supplier
          );
        }
      })
      .addCase(updateSupplier.rejected, (state, action) => {
        state.operations.isUpdating = false;
        state.error = action.payload as string;
      });

    // Delete supplier
    builder
      .addCase(deleteSupplier.pending, (state) => {
        state.operations.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.operations.isDeleting = false;
        if (state.data) {
          state.data.content = state.data.content.filter(
            (supplier) => supplier.id !== action.payload
          );
          state.data.totalElements -= 1;
        }
      })
      .addCase(deleteSupplier.rejected, (state, action) => {
        state.operations.isDeleting = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSearchFilter,
  setPageNo,
  setStatusFilter,
  clearError,
  resetFilters,
  resetState,
} = supplierSlice.actions;

export default supplierSlice.reducer;
