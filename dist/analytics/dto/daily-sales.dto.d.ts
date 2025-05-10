export declare class TopSellingItemDto {
    name: string;
    quantity: number;
    revenue: number;
}
export declare class HourlySalesDto {
    hour: number;
    sales: number;
    orderCount: number;
}
export declare class DailySalesDto {
    date: string;
    totalSales: number;
    orderCount: number;
    averageOrderValue: number;
    topSellingItems: TopSellingItemDto[];
    salesByHour: HourlySalesDto[];
}
