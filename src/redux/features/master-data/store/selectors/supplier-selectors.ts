import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";

export const selectSupplierState = (state: RootState) => state.suppliers;

export const selectAllSuppliers = createSelector(
  [selectSupplierState],
  (suppliers) => suppliers.data?.content || []
);

export const selectSupplierPagination = createSelector(
  [selectSupplierState],
  (suppliers) => ({
    pageNo: suppliers.data?.pageNo || 1,
    pageSize: suppliers.data?.pageSize || 10,
    totalPages: suppliers.data?.totalPages || 0,
    totalElements: suppliers.data?.totalElements || 0,
  })
);

export const selectSupplierFilters = createSelector(
  [selectSupplierState],
  (suppliers) => suppliers.filters
);

export const selectSupplierLoading = createSelector(
  [selectSupplierState],
  (suppliers) => suppliers.isLoading
);

export const selectSupplierOperations = createSelector(
  [selectSupplierState],
  (suppliers) => suppliers.operations
);

export const selectSupplierError = createSelector(
  [selectSupplierState],
  (suppliers) => suppliers.error
);
