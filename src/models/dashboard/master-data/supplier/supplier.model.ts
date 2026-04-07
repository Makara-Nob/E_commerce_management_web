export interface SupplierModel {
  id: number;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AllSuppliersResponse {
  content: SupplierModel[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface SupplierFetchRequest {
  pageNo: number;
  pageSize: number;
  search: string;
}
