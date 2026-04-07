import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../thunks/product-thunks";
import { ProductManagementState } from "../models/product-types";

const initialState: ProductManagementState = {
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

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
      state.filters.pageNo = 1; // Reset to page 1 on search
    },
    setPageNo: (state, action: PayloadAction<number>) => {
      state.filters.pageNo = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<string | undefined>) => {
      state.filters.categoryId = action.payload;
      state.filters.pageNo = 1;
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
    // Fetch all products
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create product
    builder
      .addCase(createProduct.pending, (state) => {
        state.operations.isCreating = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.operations.isCreating = false;
        if (state.data) {
          state.data.content = [action.payload, ...state.data.content];
          state.data.totalElements += 1;
        }
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.operations.isCreating = false;
        state.error = action.payload as string;
      });

    // Update product
    builder
      .addCase(updateProduct.pending, (state) => {
        state.operations.isUpdating = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.operations.isUpdating = false;
        if (state.data) {
          state.data.content = state.data.content.map((product) =>
            product.id === action.payload.id ? action.payload : product
          );
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.operations.isUpdating = false;
        state.error = action.payload as string;
      });

    // Delete product
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.operations.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.operations.isDeleting = false;
        if (state.data) {
          state.data.content = state.data.content.filter(
            (product) => product.id !== action.payload
          );
          state.data.totalElements -= 1;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.operations.isDeleting = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSearchFilter,
  setPageNo,
  setCategoryFilter,
  setStatusFilter,
  clearError,
  resetFilters,
  resetState,
} = productSlice.actions;

export default productSlice.reducer;
