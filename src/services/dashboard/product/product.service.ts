import { axiosClientWithAuth } from "@/utils/axios";
import {
  AllProductsResponse,
  ProductModel,
} from "@/models/dashboard/master-data/product/product.response.model";
import {
  CreateProductRequest,
  UpdateProductRequest,
  ProductVariantRequest,
} from "@/models/dashboard/master-data/product/product.request.model";

const BASE_URL = "/api/v1/admin/products";

export async function getProductByIdService(id: string): Promise<ProductModel> {
  try {
    const response = await axiosClientWithAuth.get(`${BASE_URL}/${id}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function getProductsService(
  pageNo = 1,
  pageSize = 10,
  search = ""
): Promise<AllProductsResponse> {
  try {
    const response = await axiosClientWithAuth.post(`${BASE_URL}/fetch`, {
      pageNo,
      pageSize,
      search,
    });

    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function createProductService(
  data: CreateProductRequest
): Promise<ProductModel> {
  try {
    const response = await axiosClientWithAuth.post(BASE_URL, data);
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Create a product and then bulk-add all variants via the dedicated variant
 * endpoint. Use this instead of createProductService when the form includes
 * variants built from the options generator.
 */
export async function createProductWithVariantsService(
  data: CreateProductRequest
): Promise<ProductModel> {
  // 1️⃣ Create the base product (options[] is saved by the backend directly)
  const product = await createProductService(data);
  const productId = String((product as any)._id ?? (product as any).id);

  // 2️⃣ Push each variant individually so they get their own subdoc _id
  if (data.variants && data.variants.length > 0) {
    await Promise.all(
      data.variants.map((v: ProductVariantRequest) =>
        axiosClientWithAuth.post(`${BASE_URL}/${productId}/variants`, v)
      )
    );
  }

  return product;
}

export async function updateProductService(
  id: string,
  data: UpdateProductRequest
): Promise<ProductModel> {
  try {
    const response = await axiosClientWithAuth.put(`${BASE_URL}/${id}`, data);
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteProductService(id: string): Promise<string> {
  try {
    await axiosClientWithAuth.delete(`${BASE_URL}/${id}`);
    return id;
  } catch (error) {
    throw error;
  }
}

export async function addVariantService(
  productId: string,
  variantData: Partial<ProductModel["variants"][0]>
): Promise<ProductModel["variants"][0]> {
  try {
    const response = await axiosClientWithAuth.post(
      `${BASE_URL}/${productId}/variants`,
      variantData
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function updateVariantService(
  productId: string,
  variantId: string,
  variantData: Partial<ProductModel["variants"][0]>
): Promise<ProductModel["variants"][0]> {
  try {
    const response = await axiosClientWithAuth.put(
      `${BASE_URL}/${productId}/variants/${variantId}`,
      variantData
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteVariantService(
  productId: string,
  variantId: string
): Promise<void> {
  try {
    await axiosClientWithAuth.delete(
      `${BASE_URL}/${productId}/variants/${variantId}`
    );
  } catch (error) {
    throw error;
  }
}
