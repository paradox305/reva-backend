export class TopSellingItemDto {
  name: string;
  quantity: number;
  revenue: number;
}

export class HourlySalesDto {
  hour: number;
  sales: number;
  orderCount: number;
}

export class DailySalesDto {
  date: string;
  totalSales: number;
  orderCount: number;
  averageOrderValue: number;
  topSellingItems: TopSellingItemDto[];
  salesByHour: HourlySalesDto[];
} 