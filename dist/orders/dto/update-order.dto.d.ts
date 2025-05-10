import { OrderStatus, OrderType } from '@prisma/client';
export declare class UpdateOrderItemDto {
    id?: string;
    menuItemId: string;
    quantity: number;
    notes?: string;
    modifiers?: string;
}
export declare class AddOrderItemDto {
    menuItemId: string;
    quantity: number;
    notes?: string;
    modifiers?: string;
}
export declare class UpdateOrderStatusDto {
    status: OrderStatus;
}
export declare class UpdateOrderDto {
    tableNumber?: string;
    roomNumber?: string;
    orderType?: OrderType;
    status?: OrderStatus;
    items?: UpdateOrderItemDto[];
    notes?: string;
    paymentMethod?: string;
    paymentStatus?: boolean;
}
