"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async updateInventoryStock(menuItemId, quantity, isAdd) {
        const itemUsages = await this.prisma.itemUsage.findMany({
            where: { menuItemId },
            include: { inventory: true },
        });
        for (const usage of itemUsages) {
            const stockChange = usage.quantity * quantity * (isAdd ? 1 : -1);
            const newStock = usage.inventory.currentStock + stockChange;
            if (!isAdd && newStock < 0) {
                throw new common_1.BadRequestException(`Insufficient stock for item: ${usage.inventory.name}`);
            }
            await this.prisma.inventory.update({
                where: { id: usage.inventoryId },
                data: { currentStock: newStock },
            });
        }
    }
    async calculateOrderTotals(items) {
        let subtotal = 0;
        const menuItems = await this.prisma.menuItem.findMany({
            where: {
                id: {
                    in: items.map(item => item.menuItemId),
                },
            },
        });
        for (const item of items) {
            const menuItem = menuItems.find(mi => mi.id === item.menuItemId);
            if (!menuItem) {
                throw new common_1.NotFoundException(`Menu item not found: ${item.menuItemId}`);
            }
            subtotal += menuItem.price * item.quantity;
        }
        const tax = subtotal * 0.1;
        const serviceCharge = subtotal * 0.05;
        const total = subtotal + tax + serviceCharge;
        return { subtotal, tax, serviceCharge, total };
    }
    async updateTableStatus(tableNumber, isOccupied) {
        await this.prisma.table.update({
            where: { number: parseInt(tableNumber) },
            data: { isOccupied },
        });
    }
    async create(createOrderDto) {
        const { items, ...orderData } = createOrderDto;
        const { subtotal, tax, serviceCharge, total } = await this.calculateOrderTotals(items);
        const orderNumber = `ORD${Date.now()}`;
        try {
            const order = await this.prisma.$transaction(async (prisma) => {
                const { userId, ...rest } = orderData;
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
                                throw new common_1.NotFoundException(`Menu item not found: ${item.menuItemId}`);
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
                for (const item of items) {
                    await this.updateInventoryStock(item.menuItemId, item.quantity, false);
                }
                if (createOrderDto.tableNumber) {
                    await this.updateTableStatus(createOrderDto.tableNumber, true);
                }
                return newOrder;
            });
            return order;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async findAll() {
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
        return orders;
    }
    async findOne(id) {
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
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        return order;
    }
    async update(id, updateOrderDto) {
        const existingOrder = await this.findOne(id);
        try {
            const order = await this.prisma.$transaction(async (prisma) => {
                if (updateOrderDto.status && (updateOrderDto.status === 'COMPLETED' || updateOrderDto.status === 'CANCELLED')) {
                    if (existingOrder.tableNumber) {
                        await this.updateTableStatus(existingOrder.tableNumber, false);
                    }
                }
                if (updateOrderDto.tableNumber && updateOrderDto.tableNumber !== existingOrder.tableNumber) {
                    if (existingOrder.tableNumber) {
                        await this.updateTableStatus(existingOrder.tableNumber, false);
                    }
                    await this.updateTableStatus(updateOrderDto.tableNumber, true);
                }
                if (updateOrderDto.items) {
                    for (const existingItem of existingOrder.items) {
                        const updatedItem = updateOrderDto.items.find(item => item.id === existingItem.id);
                        if (!updatedItem) {
                            await this.updateInventoryStock(existingItem.menuItemId, existingItem.quantity, true);
                        }
                        else if (updatedItem.quantity !== existingItem.quantity) {
                            const quantityDiff = existingItem.quantity - updatedItem.quantity;
                            await this.updateInventoryStock(existingItem.menuItemId, Math.abs(quantityDiff), quantityDiff > 0);
                        }
                    }
                    const newItems = updateOrderDto.items.filter(item => !item.id);
                    for (const item of newItems) {
                        await this.updateInventoryStock(item.menuItemId, item.quantity, false);
                    }
                    const { subtotal, tax, serviceCharge, total } = await this.calculateOrderTotals(updateOrderDto.items);
                    const updateData = {
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
                                    throw new common_1.NotFoundException(`Menu item not found: ${item.menuItemId}`);
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
                const basicUpdateData = {
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
            return order;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async findByTable(tableNumber) {
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
        return orders;
    }
    async getCurrentTableOrder(tableNumber) {
        const orders = await this.prisma.order.findMany({
            where: {
                tableNumber,
                status: {
                    in: ['PLACED', 'IN_KITCHEN', 'SERVED']
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
        await this.updateTableStatus(tableNumber, orders.length > 0);
        return orders.length > 0 ? orders[0] : null;
    }
    async syncTableStatuses() {
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
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map