import { axiosClientWithAuth } from "@/utils/axios";
import { 
  AllSuppliersResponse, 
  SupplierFetchRequest, 
  SupplierModel 
} from "@/models/dashboard/master-data/supplier/supplier.model";

const BASE_URL = "/api/v1/admin/suppliers";

export async function fetchSuppliersService(
  params: SupplierFetchRequest
): Promise<AllSuppliersResponse> {
  const response = await axiosClientWithAuth.post(`${BASE_URL}/fetch`, params);
  return response.data.data;
}

export async function createSupplierService(
  data: Partial<SupplierModel>
): Promise<SupplierModel> {
  const response = await axiosClientWithAuth.post(BASE_URL, data);
  return response.data.data;
}

export async function updateSupplierService(
  id: string | number,
  data: Partial<SupplierModel>
): Promise<SupplierModel> {
  const response = await axiosClientWithAuth.put(`${BASE_URL}/${id}`, data);
  return response.data.data;
}

export async function deleteSupplierService(id: string | number): Promise<void> {
  await axiosClientWithAuth.delete(`${BASE_URL}/${id}`);
}
