import { Controller, Get, Post, Body, Param, Put, Query, Patch, Delete } from '@nestjs/common';
import { OrdersService, OrderWithRelations } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto, UpdateOrderStatusDto, AddOrderItemDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto): Promise<OrderWithRelations> {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAll(): Promise<OrderWithRelations[]> {
    return this.ordersService.findAll();
  }

  @Get('table/:tableNumber')
  findByTable(@Param('tableNumber') tableNumber: string): Promise<OrderWithRelations[]> {
    return this.ordersService.findByTable(tableNumber);
  }

  @Get('table/:tableNumber/current')
  async getCurrentTableOrders(@Param('tableNumber') tableNumber: string): Promise<OrderWithRelations | null> {
    return this.ordersService.getCurrentTableOrder(tableNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<OrderWithRelations> {
    return this.ordersService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto): Promise<OrderWithRelations> {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateOrderStatusDto
  ): Promise<OrderWithRelations> {
    return this.ordersService.update(id, { status: updateStatusDto.status });
  }

  @Post(':id/items')
  async addItem(
    @Param('id') id: string,
    @Body() item: AddOrderItemDto
  ): Promise<OrderWithRelations> {
    const order = await this.ordersService.findOne(id);
    const updatedItems = [...order.items.map(i => ({
      menuItemId: i.menuItemId,
      quantity: i.quantity,
      notes: i.notes || undefined,
      modifiers: i.modifiers || undefined
    })), item];
    return this.ordersService.update(id, { items: updatedItems });
  }

  @Delete(':id/items/:menuItemId')
  async removeItem(
    @Param('id') id: string,
    @Param('menuItemId') menuItemId: string
  ): Promise<OrderWithRelations> {
    const order = await this.ordersService.findOne(id);
    const updatedItems = order.items
      .filter(item => item.menuItemId !== menuItemId)
      .map(i => ({
        menuItemId: i.menuItemId,
        quantity: i.quantity,
        notes: i.notes || undefined,
        modifiers: i.modifiers || undefined
      }));
    return this.ordersService.update(id, { items: updatedItems });
  }

  @Patch(':id/items/:menuItemId')
  async updateItemQuantity(
    @Param('id') id: string,
    @Param('menuItemId') menuItemId: string,
    @Body('quantity') quantity: number
  ): Promise<OrderWithRelations> {
    const order = await this.ordersService.findOne(id);
    const updatedItems = order.items.map(item => 
      item.menuItemId === menuItemId 
        ? {
            menuItemId: item.menuItemId,
            quantity: quantity,
            notes: item.notes || undefined,
            modifiers: item.modifiers || undefined
          }
        : {
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            notes: item.notes || undefined,
            modifiers: item.modifiers || undefined
          }
    );
    return this.ordersService.update(id, { items: updatedItems });
  }

  @Post('sync-table-statuses')
  async syncTableStatuses() {
    await this.ordersService.syncTableStatuses();
    return { message: 'Table statuses synchronized successfully' };
  }
} 