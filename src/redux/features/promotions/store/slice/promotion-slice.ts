import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PromotionSearchResponse } from "../models/response/promotion-response";
import { 
  fetchAllPromotionsService, 
  createPromotionService, 
  updatePromotionService, 
  deletePromotionService 
} from "../thunks/promotion-thunks";

interface PromotionState {
  data: PromotionSearchResponse | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    search: string;
    pageNo: number;
  };
  operations: {
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
  };
}

const initialState: PromotionState = {
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

const promotionSlice = createSlice({
  name: "promotions",
  initialState,
  reducers: {
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
      state.filters.pageNo = 1;
    },
    setPageNo: (state, action: PayloadAction<number>) => {
      state.filters.pageNo = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPromotionsService.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllPromotionsService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchAllPromotionsService.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createPromotionService.pending, (state) => {
        state.operations.isCreating = true;
      })
      .addCase(createPromotionService.fulfilled, (state, action) => {
        state.operations.isCreating = false;
        if (state.data) {
          state.data.content = [action.payload, ...state.data.content];
          state.data.totalElements += 1;
        }
      })
      .addCase(createPromotionService.rejected, (state, action) => {
        state.operations.isCreating = false;
        state.error = action.payload as string;
      })
      .addCase(updatePromotionService.pending, (state) => {
        state.operations.isUpdating = true;
      })
      .addCase(updatePromotionService.fulfilled, (state, action) => {
        state.operations.isUpdating = false;
        if (state.data) {
          state.data.content = state.data.content.map((p) =>
            p.id === action.payload.id ? action.payload : p
          );
        }
      })
      .addCase(updatePromotionService.rejected, (state, action) => {
        state.operations.isUpdating = false;
        state.error = action.payload as string;
      })
      .addCase(deletePromotionService.pending, (state) => {
        state.operations.isDeleting = true;
      })
      .addCase(deletePromotionService.fulfilled, (state, action) => {
        state.operations.isDeleting = false;
        if (state.data) {
          state.data.content = state.data.content.filter((p) => p.id !== action.payload);
          state.data.totalElements -= 1;
        }
      })
      .addCase(deletePromotionService.rejected, (state, action) => {
        state.operations.isDeleting = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSearchFilter, setPageNo, clearError, resetFilters } = promotionSlice.actions;
export default promotionSlice.reducer;
