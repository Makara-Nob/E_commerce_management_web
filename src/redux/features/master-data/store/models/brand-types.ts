import { AllBrandsResponse } from "@/models/dashboard/master-data/brand/brand.model";

export interface BrandFilters {
  search: string;
  status?: string;
  pageNo: number;
}

export interface BrandOperations {
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

export interface BrandManagementState {
  data: AllBrandsResponse | null;
  isLoading: boolean;
  error: string | null;
  filters: BrandFilters;
  operations: BrandOperations;
}
