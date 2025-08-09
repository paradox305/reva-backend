import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderItem, Prisma } from '@prisma/client';

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

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  private async updateInventoryStock(menuItemId: string, quantity: number, isAdd: boolean) {
    // Get all inventory items used by this menu item
    const itemUsages = await this.prisma.itemUsage.findMany({
      where: { menuItemId },
      include: { inventory: true },
    });

    // Update each inventory item's stock
    for (const usage of itemUsages) {
      const stockChange = usage.quantity * quantity * (isAdd ? 1 : -1);
      const newStock = usage.inventory.currentStock + stockChange;

      if (!isAdd && newStock < 0) {
        throw new BadRequestException(`Insufficient stock for item: ${usage.inventory.name}`);
      }

      await this.prisma.inventory.update({
        where: { id: usage.inventoryId },
        data: { currentStock: newStock },
      });
    }
  }

  private async calculateOrderTotals(items: { menuItemId: string; quantity: number }[]) {
    let subtotal = 0;

    // Get menu items with their prices
    const menuItems = await this.prisma.menuItem.findMany({
      where: {
        id: {
          in: items.map(item => item.menuItemId),
        },
      },
    });

    // Calculate subtotal
    for (const item of items) {
      const menuItem = menuItems.find(mi => mi.id === item.menuItemId);
      if (!menuItem) {
        throw new NotFoundException(`Menu item not found: ${item.menuItemId}`);
      }
      subtotal += menuItem.price * item.quantity;
    }

    // Calculate other amounts (you can adjust these percentages as needed)
    const tax = 0
    const serviceCharge = 0
    const total = subtotal + tax + serviceCharge;

    return { subtotal, tax, serviceCharge, total };
  }

  private async updateTableStatus(tableNumber: string, isOccupied: boolean) {
    await this.prisma.table.update({
      where: { number: parseInt(tableNumber) },
      data: { isOccupied },
    });
  }

  async create(createOrderDto: CreateOrderDto): Promise<OrderWithRelations> {
    const { items, ...orderData } = createOrderDto;

    // Calculate order totals
    const { subtotal, tax, serviceCharge, total } = await this.calculateOrderTotals(items);

    // Generate unique order number
    const orderNumber = `ORD${Date.now()}`;

    // Create order with items in a transaction
    try {
      const order = await this.prisma.$transaction(async (prisma) => {
        // Prepare create data
        const { userId, ...rest } = orderData as any; // Exclude userId from spread
        const createData = {
          ...rest,
          orderNumber,
          subtotal,
          tax,
          serviceCharge,
          total,
          items: {
            create: await Promise.all(items.map(async (item) => {
              const menuItem = await prisma.menuItem.findUnique({
                where: { id: item.menuItemId },
              });
              if (!menuItem) {
                throw new NotFoundException(`Menu item not found: ${item.menuItemId}`);
              }
              return {
                ...item,
                price: menuItem.price,
              };
            })),
          },
        };

        const newOrder = await prisma.order.create({
          data: createData,
          include: {
            items: {
              include: {
                menuItem: true,
              },
            },
            user: true,
          },
        });

        // Update inventory stock
        for (const item of items) {
          await this.updateInventoryStock(item.menuItemId, item.quantity, false);
        }

        // Update table status to occupied
        if (createOrderDto.tableNumber) {
          await this.updateTableStatus(createOrderDto.tableNumber, true);
        }

        return newOrder;
      });

      return order as OrderWithRelations;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(): Promise<OrderWithRelations[]> {
    const orders = await this.prisma.order.findMany({
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        user: true,
      },
    });
    return orders as OrderWithRelations[];
  }

  async findOne(id: string): Promise<OrderWithRelations> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        user: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order as OrderWithRelations;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<OrderWithRelations> {
    const existingOrder = await this.findOne(id);

    try {
      const order = await this.prisma.$transaction(async (prisma) => {
        // If status is being updated to COMPLETED or CANCELLED, update table status
        if (updateOrderDto.status && (updateOrderDto.status === 'COMPLETED' || updateOrderDto.status === 'CANCELLED')) {
          if (existingOrder.tableNumber) {
            await this.updateTableStatus(existingOrder.tableNumber, false);
          }
        }
        
        // If table number is being changed
        if (updateOrderDto.tableNumber && updateOrderDto.tableNumber !== existingOrder.tableNumber) {
          // Free up the old table
          if (existingOrder.tableNumber) {
            await this.updateTableStatus(existingOrder.tableNumber, false);
          }
          // Occupy the new table
          await this.updateTableStatus(updateOrderDto.tableNumber, true);
        }

        if (updateOrderDto.items) {
          // Restore inventory for removed items
          for (const existingItem of existingOrder.items) {
            const updatedItem = updateOrderDto.items.find(item => item.id === existingItem.id);
            if (!updatedItem) {
              await this.updateInventoryStock(existingItem.menuItemId, existingItem.quantity, true);
            } else if (updatedItem.quantity !== existingItem.quantity) {
              const quantityDiff = existingItem.quantity - updatedItem.quantity;
              await this.updateInventoryStock(existingItem.menuItemId, Math.abs(quantityDiff), quantityDiff > 0);
            }
          }

          // Handle new items
          const newItems = updateOrderDto.items.filter(item => !item.id);
          for (const item of newItems) {
            await this.updateInventoryStock(item.menuItemId, item.quantity, false);
          }

          // Calculate new totals
          const { subtotal, tax, serviceCharge, total } = await this.calculateOrderTotals(updateOrderDto.items);

          // Update the order
          const updateData: Prisma.OrderUpdateInput = {
            tableNumber: updateOrderDto.tableNumber,
            roomNumber: updateOrderDto.roomNumber,
            orderType: updateOrderDto.orderType,
            status: updateOrderDto.status,
            notes: updateOrderDto.notes,
            paymentMethod: updateOrderDto.paymentMethod,
            paymentStatus: updateOrderDto.paymentStatus,
            subtotal,
            tax,
            serviceCharge,
            total,
            items: {
              deleteMany: {},
              create: await Promise.all(updateOrderDto.items.map(async (item) => {
                const menuItem = await prisma.menuItem.findUnique({
                  where: { id: item.menuItemId },
                });
                if (!menuItem) {
                  throw new NotFoundException(`Menu item not found: ${item.menuItemId}`);
                }
                return {
                  menuItemId: item.menuItemId,
                  quantity: item.quantity,
                  price: menuItem.price,
                  notes: item.notes,
                  modifiers: item.modifiers,
                };
              })),
            },
          };

          return await prisma.order.update({
            where: { id },
            data: updateData,
            include: {
              items: {
                include: {
                  menuItem: true,
                },
              },
              user: true,
            },
          });
        }

        // If no items are being updated, just update the order details
        const basicUpdateData: Prisma.OrderUpdateInput = {
          tableNumber: updateOrderDto.tableNumber,
          roomNumber: updateOrderDto.roomNumber,
          orderType: updateOrderDto.orderType,
          status: updateOrderDto.status,
          notes: updateOrderDto.notes,
          paymentMethod: updateOrderDto.paymentMethod,
          paymentStatus: updateOrderDto.paymentStatus,
        };

        return await prisma.order.update({
          where: { id },
          data: basicUpdateData,
          include: {
            items: {
              include: {
                menuItem: true,
              },
            },
            user: true,
          },
        });
      });

      return order as OrderWithRelations;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findByTable(tableNumber: string): Promise<OrderWithRelations[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        tableNumber,
        status: {
          not: 'COMPLETED',
        },
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        user: true,
      },
    });
    return orders as OrderWithRelations[];
  }

  async getCurrentTableOrder(tableNumber: string): Promise<OrderWithRelations | null> {
    const orders = await this.prisma.order.findMany({
      where: {
        tableNumber,
        status: {
          in: ['PLACED', 'IN_KITCHEN', 'SERVED'] as const
        },
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 1,
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        user: true,
      },
    });
    
    // Update table status based on current order
    await this.updateTableStatus(tableNumber, orders.length > 0);
    
    return orders.length > 0 ? orders[0] as OrderWithRelations : null;
  }

  async syncTableStatuses(): Promise<void> {
    const tables = await this.prisma.table.findMany();
    
    for (const table of tables) {
      const hasActiveOrder = await this.prisma.order.findFirst({
        where: {
          tableNumber: table.number.toString(),
          status: {
            in: ['PLACED', 'IN_KITCHEN', 'SERVED']
          },
        },
      });
      
      if (table.isOccupied !== !!hasActiveOrder) {
        await this.updateTableStatus(table.number.toString(), !!hasActiveOrder);
      }
    }
  }
} 