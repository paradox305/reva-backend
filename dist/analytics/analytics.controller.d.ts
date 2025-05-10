import { AnalyticsService } from './analytics.service';
import { DailySalesDto } from './dto/daily-sales.dto';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDailySales(date?: string): Promise<DailySalesDto>;
}
