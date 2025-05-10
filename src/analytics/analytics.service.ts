import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DailySalesDto, TopSellingItemDto, HourlySalesDto } from './dto/daily-sales.dto';
import { startOfDay, endOfDay, parseISO } from 'date-fns';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDailySales(date?: string): Promise<DailySalesDto> {
    const targetDate = date ? parseISO(date) : new Date();
    const start = startOfDay(targetDate);
    const end = endOfDay(targetDate);

    // Get all orders for the day
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

    // Calculate total sales and order count
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const orderCount = orders.length;
    const averageOrderValue = orderCount > 0 ? totalSales / orderCount : 0;

    // Calculate top selling items
    const itemSales = new Map<string, { name: string; quantity: number; revenue: number }>();
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

    const topSellingItems: TopSellingItemDto[] = Array.from(itemSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Calculate sales by hour
    const salesByHour: HourlySalesDto[] = Array.from({ length: 24 }, (_, hour) => {
      const hourOrders = orders.filter(
        order => new Date(order.createdAt).getHours() === hour
      );
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
} 