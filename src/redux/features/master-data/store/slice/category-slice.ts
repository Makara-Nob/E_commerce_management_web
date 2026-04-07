import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialCategoryState } from "../state/category-state";
import {
  fetchAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../thunks/category-thunks";
import { AllCategoriesResponse } from "@/models/dashboard/master-data/category/category.model";

const categorySlice = createSlice({
  name: "category",
  initialState: initialCategoryState,
  reducers: {
    resetCategoryStatus: (state) => {
      state.isLoading = false;
      state.isSubmitting = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all
    builder
      .addCase(fetchAllCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchAllCategories.fulfilled,
        (state, action: PayloadAction<AllCategoriesResponse>) => {
          state.isLoading = false;
          state.categories = action.payload?.content || [];
          state.totalElements =
            action.payload?.totalElements || action.payload?.content?.length || 0;
          state.totalPages = action.payload?.totalPages || (action.payload?.content?.length ? 1 : 0);
          state.pageNo = action.payload?.pageNo || 1;
          state.pageSize = action.payload?.pageSize || 10;
          state.last = action.payload?.last ?? true;
        },
      )
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create
    builder
      .addCase(createCategory.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state) => {
        state.isSubmitting = false;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });

    // Update
    builder
      .addCase(updateCategory.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state) => {
        state.isSubmitting = false;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });

    // Delete
    builder
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetCategoryStatus } = categorySlice.actions;
export default categorySlice.reducer;
