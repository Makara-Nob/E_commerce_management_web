import { AllProductsResponse } from "@/models/dashboard/master-data/product/product.response.model";

export interface ProductFilters {
  search: string;
  categoryId?: string;
  status?: string;
  pageNo: number;
}

export interface ProductOperations {
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

export interface ProductManagementState {
  data: AllProductsResponse | null;
  isLoading: boolean;
  error: string | null;
  filters: ProductFilters;
  operations: ProductOperations;
}
