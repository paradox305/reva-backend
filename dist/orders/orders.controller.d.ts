import { OrdersService, OrderWithRelations } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto, UpdateOrderStatusDto, AddOrderItemDto } from './dto/update-order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto): Promise<OrderWithRelations>;
    findAll(): Promise<OrderWithRelations[]>;
    findByTable(tableNumber: string): Promise<OrderWithRelations[]>;
    getCurrentTableOrders(tableNumber: string): Promise<OrderWithRelations | null>;
    findOne(id: string): Promise<OrderWithRelations>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<OrderWithRelations>;
    updateStatus(id: string, updateStatusDto: UpdateOrderStatusDto): Promise<OrderWithRelations>;
    addItem(id: string, item: AddOrderItemDto): Promise<OrderWithRelations>;
    removeItem(id: string, menuItemId: string): Promise<OrderWithRelations>;
    updateItemQuantity(id: string, menuItemId: string, quantity: number): Promise<OrderWithRelations>;
    syncTableStatuses(): Promise<{
        message: string;
    }>;
}
