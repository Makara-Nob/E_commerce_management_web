import { RootState } from "@/redux/store";
import { createSelector } from "@reduxjs/toolkit";

const selectProductState = (state: RootState) => state.products;

export const selectProducts = createSelector(
  [selectProductState],
  (products) => products
);

export const selectProductsContent = createSelector(
  [selectProductState],
  (products) => products.data?.content || []
);

export const selectIsLoading = createSelector(
  [selectProductState],
  (products) => products.isLoading
);

export const selectError = createSelector(
  [selectProductState],
  (products) => products.error
);

export const selectFilters = createSelector(
  [selectProductState],
  (products) => products.filters
);

export const selectOperations = createSelector(
  [selectProductState],
  (products) => products.operations
);

export const selectPagination = createSelector(
  [selectProductState],
  (products) => ({
    pageNo: products.data?.pageNo || 1,
    pageSize: products.data?.pageSize || 10,
    totalPages: products.data?.totalPages || 0,
    totalElements: products.data?.totalElements || 0,
  })
);
