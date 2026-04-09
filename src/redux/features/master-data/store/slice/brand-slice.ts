import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchAllBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../thunks/brand-thunks";
import { BrandManagementState } from "../models/brand-types";

const initialState: BrandManagementState = {
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

const brandSlice = createSlice({
  name: "brands",
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
    // Fetch all brands
    builder
      .addCase(fetchAllBrands.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllBrands.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchAllBrands.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create brand
    builder
      .addCase(createBrand.pending, (state) => {
        state.operations.isCreating = true;
        state.error = null;
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.operations.isCreating = false;
        if (state.data) {
          state.data.content = [action.payload, ...state.data.content];
          state.data.totalElements += 1;
        }
      })
      .addCase(createBrand.rejected, (state, action) => {
        state.operations.isCreating = false;
        state.error = action.payload as string;
      });

    // Update brand
    builder
      .addCase(updateBrand.pending, (state) => {
        state.operations.isUpdating = true;
        state.error = null;
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        state.operations.isUpdating = false;
        if (state.data) {
          state.data.content = state.data.content.map((brand) =>
            brand.id === action.payload.id ? action.payload : brand
          );
        }
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.operations.isUpdating = false;
        state.error = action.payload as string;
      });

    // Delete brand
    builder
      .addCase(deleteBrand.pending, (state) => {
        state.operations.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.operations.isDeleting = false;
        if (state.data) {
          state.data.content = state.data.content.filter(
            (brand) => brand.id !== action.payload
          );
          state.data.totalElements -= 1;
        }
      })
      .addCase(deleteBrand.rejected, (state, action) => {
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
} = brandSlice.actions;

export default brandSlice.reducer;
