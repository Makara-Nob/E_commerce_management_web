import { axiosClientWithAuth } from "@/utils/axios";
import { 
  AllBrandsResponse, 
  BrandFetchRequest, 
  BrandModel 
} from "@/models/dashboard/master-data/brand/brand.model";

const BASE_URL = "/api/v1/admin/brands";

export async function fetchBrandsService(
  params: BrandFetchRequest
): Promise<AllBrandsResponse> {
  const response = await axiosClientWithAuth.post(`${BASE_URL}/fetch`, params);
  return response.data.data;
}

export async function createBrandService(
  data: Partial<BrandModel>
): Promise<BrandModel> {
  const response = await axiosClientWithAuth.post(BASE_URL, data);
  return response.data.data;
}

export async function updateBrandService(
  id: string | number,
  data: Partial<BrandModel>
): Promise<BrandModel> {
  const response = await axiosClientWithAuth.put(`${BASE_URL}/${id}`, data);
  return response.data.data;
}

export async function deleteBrandService(id: string | number): Promise<void> {
  await axiosClientWithAuth.delete(`${BASE_URL}/${id}`);
}
