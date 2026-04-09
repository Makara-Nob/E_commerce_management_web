import { ProductModel } from "@/models/dashboard/master-data/product/product.response.model";

export interface OrderUserModel {
    _id: number;
    fullName: string;
    email: string;
    phone: string;
}

export interface OrderItemModel {
    id: number;
    product: ProductModel | number;
    quantity: number;
    unitPrice: number;
    subTotal: number;
    variantId?: number;
    variantName?: string;
}

export interface OrderModel {
    id: number;
    invoiceNumber: string;
    userId: number;
    user?: OrderUserModel;
    totalAmount: number;
    discountAmount: number;
    netAmount: number;
    status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    paymentMethod: 'CASH' | 'CARD' | 'ABA_PAYWAY';
    paywayTranId?: string;
    paywayStatus?: string;
    shippingAddress: string;
    note?: string;
    items: OrderItemModel[];
    createdAt: string;
    updatedAt: string;
}

export interface OrderSearchResponse {
    content: OrderModel[];
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}
