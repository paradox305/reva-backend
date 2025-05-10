import { PrismaService } from '../prisma/prisma.service';
import { DailySalesDto } from './dto/daily-sales.dto';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDailySales(date?: string): Promise<DailySalesDto>;
}
