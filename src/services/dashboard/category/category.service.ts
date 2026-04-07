import { axiosClientWithAuth } from "@/utils/axios";
import { 
  AllCategoriesResponse, 
  CategoryFetchRequest, 
  CategoryModel, 
  CategoryRequest 
} from "@/models/dashboard/master-data/category/category.model";

const BASE_URL = "/api/v1/admin/categories";
const PUBLIC_URL = "/api/v1/public/categories";

export async function fetchCategoriesService(
  params: CategoryFetchRequest
): Promise<AllCategoriesResponse> {
  const response = await axiosClientWithAuth.post(`${BASE_URL}/fetch`, params);
  // The backend wraps the response in a "data" field
  return response.data.data;
}

export async function createCategoryService(
  data: CategoryRequest
): Promise<CategoryModel> {
  const response = await axiosClientWithAuth.post(BASE_URL, data);
  return response.data.data;
}

export async function updateCategoryService(
  id: string,
  data: CategoryRequest
): Promise<CategoryModel> {
  const response = await axiosClientWithAuth.put(`${BASE_URL}/${id}`, data);
  return response.data.data;
}

export async function deleteCategoryService(id: string): Promise<void> {
  await axiosClientWithAuth.delete(`${BASE_URL}/${id}`);
}
