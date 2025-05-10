import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { TablesService } from './tables.service';

interface CreateTableDto {
  number: number;
  capacity: number;
}

@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  async createTable(@Body() createTableDto: CreateTableDto) {
    return this.tablesService.createTable({
      number: createTableDto.number,
      capacity: createTableDto.capacity,
    });
  }

  @Get()
  async getTables() {
    return this.tablesService.getTables();
  }

  @Get(':id')
  async getTableById(@Param('id', ParseIntPipe) id: number) {
    return this.tablesService.getTableById(id);
  }

  @Get('number/:number')
  async getTableByNumber(@Param('number', ParseIntPipe) number: number) {
    return this.tablesService.getTableByNumber(number);
  }
} 