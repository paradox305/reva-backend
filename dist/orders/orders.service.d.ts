import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderItem } from '@prisma/client';
export interface OrderWithRelations extends Order {
    items: (OrderItem & {
        menuItem: {
            id: string;
            name: string;
            price: number;
            category: string;
        };
    })[];
    user?: {
        id: string;
        name: string;
    };
}
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    private updateInventoryStock;
    private calculateOrderTotals;
    private updateTableStatus;
    create(createOrderDto: CreateOrderDto): Promise<OrderWithRelations>;
    findAll(): Promise<OrderWithRelations[]>;
    findOne(id: string): Promise<OrderWithRelations>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<OrderWithRelations>;
    findByTable(tableNumber: string): Promise<OrderWithRelations[]>;
    getCurrentTableOrder(tableNumber: string): Promise<OrderWithRelations | null>;
    syncTableStatuses(): Promise<void>;
}
