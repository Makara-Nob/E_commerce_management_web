import { ProductModel } from "@/models/dashboard/master-data/product/product.response.model";

export interface PromotionModel {
  id: number;
  name: string;
  description?: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  startDate: string;
  endDate: string;
  productId: number;
  productName: string;
  product?: ProductModel;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
  updatedAt?: string;
}

export interface PromotionSearchResponse {
  content: PromotionModel[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
