export interface ProductOption {
  name: string;    // e.g. "Size", "Color", "Weight"
  values: string[]; // e.g. ["S", "M", "L"]
}

export interface ProductVariantRequest {
  variantName?: string;       // auto-generated label e.g. "M / Red"
  sku?: string;
  optionValues: string[];     // the combination e.g. ["M", "Red"]
  stockQuantity: number;
  additionalPrice: number;
  discountType?: 'PERCENTAGE' | 'FIXED';
  discountValue?: number;
}

export interface CreateProductRequest {
  name: string;
  sku: string;
  description?: string;
  category?: number;
  supplier?: number;
  brand?: number;
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  minStock: number;
  discountType?: 'PERCENTAGE' | 'FIXED';
  discountValue?: number;
  imageUrl?: string;
  status?: "ACTIVE" | "INACTIVE";
  options?: ProductOption[];
  variants?: ProductVariantRequest[];
  relatedProducts?: number[];
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string;
}

export interface SearchProductRequest {
  pageNo: number;
  pageSize: number;
  search: string;
}
