export interface BannerModel {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  displayOrder: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
  updatedAt?: string;
}

export interface BannerSearchResponse {
  content: BannerModel[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
