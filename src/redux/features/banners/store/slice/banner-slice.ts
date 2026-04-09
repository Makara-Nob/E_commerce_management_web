import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BannerSearchResponse } from "../models/response/banner-response";
import { 
  fetchAllBannersService, 
  createBannerService, 
  updateBannerService, 
  deleteBannerService 
} from "../thunks/banner-thunks";

interface BannerState {
  data: BannerSearchResponse | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    search: string;
    status: string;
    pageNo: number;
  };
  operations: {
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
  };
}

const initialState: BannerState = {
  data: null,
  isLoading: false,
  error: null,
  filters: {
    search: "",
    status: "",
    pageNo: 1,
  },
  operations: {
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
  },
};

const bannerSlice = createSlice({
  name: "banners",
  initialState,
  reducers: {
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.filters.status = action.payload;
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
      .addCase(fetchAllBannersService.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllBannersService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchAllBannersService.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createBannerService.pending, (state) => {
        state.operations.isCreating = true;
      })
      .addCase(createBannerService.fulfilled, (state, action) => {
        state.operations.isCreating = false;
        if (state.data) {
          state.data.content = [action.payload, ...state.data.content];
          state.data.totalElements += 1;
        }
      })
      .addCase(createBannerService.rejected, (state, action) => {
        state.operations.isCreating = false;
        state.error = action.payload as string;
      })
      .addCase(updateBannerService.pending, (state) => {
        state.operations.isUpdating = true;
      })
      .addCase(updateBannerService.fulfilled, (state, action) => {
        state.operations.isUpdating = false;
        if (state.data) {
          state.data.content = state.data.content.map((b) =>
            b.id === action.payload.id ? action.payload : b
          );
        }
      })
      .addCase(updateBannerService.rejected, (state, action) => {
        state.operations.isUpdating = false;
        state.error = action.payload as string;
      })
      .addCase(deleteBannerService.pending, (state) => {
        state.operations.isDeleting = true;
      })
      .addCase(deleteBannerService.fulfilled, (state, action) => {
        state.operations.isDeleting = false;
        if (state.data) {
          state.data.content = state.data.content.filter((b) => b.id !== action.payload);
          state.data.totalElements -= 1;
        }
      })
      .addCase(deleteBannerService.rejected, (state, action) => {
        state.operations.isDeleting = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSearchFilter, setStatusFilter, setPageNo, clearError, resetFilters } = bannerSlice.actions;
export default bannerSlice.reducer;
