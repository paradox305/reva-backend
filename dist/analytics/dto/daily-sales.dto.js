"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailySalesDto = exports.HourlySalesDto = exports.TopSellingItemDto = void 0;
class TopSellingItemDto {
    name;
    quantity;
    revenue;
}
exports.TopSellingItemDto = TopSellingItemDto;
class HourlySalesDto {
    hour;
    sales;
    orderCount;
}
exports.HourlySalesDto = HourlySalesDto;
class DailySalesDto {
    date;
    totalSales;
    orderCount;
    averageOrderValue;
    topSellingItems;
    salesByHour;
}
exports.DailySalesDto = DailySalesDto;
//# sourceMappingURL=daily-sales.dto.js.map