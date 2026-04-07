export interface AllProductsResponse {
  content: ProductModel[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ProductModel {
  id: string; // From _id in backend
  name: string;
  sku: string;
  description?: string;
  category?: {
    id: number;
    name: string;
  };
  supplier?: {
    id: number;
    name: string;
  };
  brand?: {
    id: number;
    name: string;
  };
  quantity: number;
  minStock: number;
  costPrice: number;
  sellingPrice: number;
  status: string;
  viewCount: number;
  imageUrl?: string;
  images: string[];
  variants: ProductVariantModel[];
  options: {
    name: string;
    values: string[];
  }[];
  relatedProducts: any[];
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariantModel {
  _id?: string;
  variantName?: string;
  sku?: string;
  optionValues: string[];
  stockQuantity: number;
  additionalPrice: number;
  imageUrl?: string;
  discountType?: 'PERCENTAGE' | 'FIXED';
  discountValue?: number;
  status: string;
}
