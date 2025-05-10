import { OrderType } from '@prisma/client';
export declare class CreateOrderItemDto {
    menuItemId: string;
    quantity: number;
    notes?: string;
    modifiers?: string;
}
export declare class CreateOrderDto {
    tableNumber: string;
    roomNumber?: string;
    orderType: OrderType;
    userId?: string;
    items: CreateOrderItemDto[];
    notes?: string;
}
