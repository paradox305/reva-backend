import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { DailySalesDto } from './dto/daily-sales.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('daily-sales')
  async getDailySales(@Query('date') date?: string): Promise<DailySalesDto> {
    return this.analyticsService.getDailySales(date);
  }
} 