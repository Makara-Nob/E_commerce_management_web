export interface BrandModel {
  id: number;
  name: string;
  description?: string;
  logoUrl?: string;
  imageUrl?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AllBrandsResponse {
  content: BrandModel[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface BrandFetchRequest {
  pageNo: number;
  pageSize: number;
  search: string;
}
