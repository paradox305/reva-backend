"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const date_fns_1 = require("date-fns");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDailySales(date) {
        const targetDate = date ? (0, date_fns_1.parseISO)(date) : new Date();
        const start = (0, date_fns_1.startOfDay)(targetDate);
        const end = (0, date_fns_1.endOfDay)(targetDate);
        const orders = await this.prisma.order.findMany({
            where: {
                createdAt: {
                    gte: start,
                    lte: end,
                },
                status: {
                    in: ['COMPLETED', 'BILLED'],
                },
            },
            include: {
                items: {
                    include: {
                        menuItem: true,
                    },
                },
            },
        });
        const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
        const orderCount = orders.length;
        const averageOrderValue = orderCount > 0 ? totalSales / orderCount : 0;
        const itemSales = new Map();
        orders.forEach(order => {
            order.items.forEach(item => {
                const existing = itemSales.get(item.menuItemId) || {
                    name: item.menuItem.name,
                    quantity: 0,
                    revenue: 0,
                };
                existing.quantity += item.quantity;
                existing.revenue += item.price * item.quantity;
                itemSales.set(item.menuItemId, existing);
            });
        });
        const topSellingItems = Array.from(itemSales.values())
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);
        const salesByHour = Array.from({ length: 24 }, (_, hour) => {
            const hourOrders = orders.filter(order => new Date(order.createdAt).getHours() === hour);
            return {
                hour,
                sales: hourOrders.reduce((sum, order) => sum + order.total, 0),
                orderCount: hourOrders.length,
            };
        });
        return {
            date: targetDate.toISOString().split('T')[0],
            totalSales,
            orderCount,
            averageOrderValue,
            topSellingItems,
            salesByHour,
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map