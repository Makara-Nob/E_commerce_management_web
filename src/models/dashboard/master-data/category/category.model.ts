export interface CategoryModel {
  id: number; // From _id (Number)
  name: string;
  description?: string;
  code?: string;
  imageUrl?: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryRequest {
  name: string;
  description?: string;
  code?: string;
  imageUrl?: string;
}

export interface CategoryFetchRequest {
  pageNo?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}

export interface AllCategoriesResponse {
  content: CategoryModel[];
  pageNo?: number;
  pageSize?: number;
  totalElements?: number;
  totalPages?: number;
  last?: boolean;
}
