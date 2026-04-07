import { createApiThunk } from "@/utils/axios/apiWrapper";
import {
  getProductsService,
  createProductService,
  updateProductService,
  deleteProductService,
} from "@/services/dashboard/product/product.service";
import {
  CreateProductRequest,
  UpdateProductRequest,
} from "@/models/dashboard/master-data/product/product.request.model";

export const fetchAllProducts = createApiThunk<any, { pageNo: number; pageSize: number; search: string }>(
  "products/fetchAll",
  async ({ pageNo, pageSize, search }) => {
    return await getProductsService(pageNo, pageSize, search);
  }
);

export const createProduct = createApiThunk<any, CreateProductRequest>(
  "products/create",
  async (data) => {
    return await createProductService(data);
  }
);

export const updateProduct = createApiThunk<any, { id: string; data: UpdateProductRequest }>(
  "products/update",
  async ({ id, data }) => {
    return await updateProductService(id, data);
  }
);

export const deleteProduct = createApiThunk<any, string>(
  "products/delete",
  async (id) => {
    return await deleteProductService(id);
  }
);
