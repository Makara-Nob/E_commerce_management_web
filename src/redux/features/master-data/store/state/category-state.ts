import { 
  AllCategoriesResponse, 
  CategoryModel 
} from "@/models/dashboard/master-data/category/category.model";

export interface CategoryState {
  categories: CategoryModel[];
  totalElements: number;
  totalPages: number;
  pageNo: number;
  pageSize: number;
  last: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
}

export const initialCategoryState: CategoryState = {
  categories: [],
  totalElements: 0,
  totalPages: 0,
  pageNo: 1,
  pageSize: 10,
  last: false,
  isLoading: false,
  isSubmitting: false,
  error: null,
};
