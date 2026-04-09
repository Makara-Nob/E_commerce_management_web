import { RootState } from "@/redux/store";
import { createSelector } from "@reduxjs/toolkit";

const selectBrandState = (state: RootState) => state.brands;

export const selectBrands = createSelector(
  [selectBrandState],
  (brands) => brands
);

export const selectBrandsContent = createSelector(
  [selectBrandState],
  (brands) => brands.data?.content || []
);

export const selectIsLoading = createSelector(
  [selectBrandState],
  (brands) => brands.isLoading
);

export const selectError = createSelector(
  [selectBrandState],
  (brands) => brands.error
);

export const selectFilters = createSelector(
  [selectBrandState],
  (brands) => brands.filters
);

export const selectOperations = createSelector(
  [selectBrandState],
  (brands) => brands.operations
);

export const selectPagination = createSelector(
  [selectBrandState],
  (brands) => ({
    pageNo: brands.data?.pageNo || 1,
    pageSize: brands.data?.pageSize || 10,
    totalPages: brands.data?.totalPages || 0,
    totalElements: brands.data?.totalElements || 0,
  })
);
