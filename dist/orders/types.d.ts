import { Order, OrderItem, MenuItem, User } from '@prisma/client';
export interface OrderWithRelations extends Order {
    items: (OrderItem & {
        menuItem: MenuItem;
    })[];
    user: User;
}
