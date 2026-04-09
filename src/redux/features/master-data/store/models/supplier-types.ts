import { AllSuppliersResponse } from "@/models/dashboard/master-data/supplier/supplier.model";

export interface SupplierFilters {
  search: string;
  status?: string;
  pageNo: number;
}

export interface SupplierOperations {
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

export interface SupplierManagementState {
  data: AllSuppliersResponse | null;
  isLoading: boolean;
  error: string | null;
  filters: SupplierFilters;
  operations: SupplierOperations;
}
