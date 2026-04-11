export interface DashRecentOrder {
    id: string;
    invoiceNumber: string;
    customerName: string;
    customerProfile?: string;
    amount: number;
    status: string;
    createdAt: string;
}

export interface DaySaleTrend {
    date: string;
    revenue: number;
    orderCount: number;
}

export interface DashboardSummaryData {
    summary: {
        totalRevenue: number;
        totalOrders: number;
        activeOrders: number;
        totalCustomers: number;
        totalProducts: number;
    };
    salesTrend: DaySaleTrend[];
    recentOrders: DashRecentOrder[];
}
