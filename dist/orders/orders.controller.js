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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
const create_order_dto_1 = require("./dto/create-order.dto");
const update_order_dto_1 = require("./dto/update-order.dto");
let OrdersController = class OrdersController {
    ordersService;
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    create(createOrderDto) {
        return this.ordersService.create(createOrderDto);
    }
    findAll() {
        return this.ordersService.findAll();
    }
    findByTable(tableNumber) {
        return this.ordersService.findByTable(tableNumber);
    }
    async getCurrentTableOrders(tableNumber) {
        return this.ordersService.getCurrentTableOrder(tableNumber);
    }
    findOne(id) {
        return this.ordersService.findOne(id);
    }
    update(id, updateOrderDto) {
        return this.ordersService.update(id, updateOrderDto);
    }
    async updateStatus(id, updateStatusDto) {
        return this.ordersService.update(id, { status: updateStatusDto.status });
    }
    async addItem(id, item) {
        const order = await this.ordersService.findOne(id);
        const updatedItems = [...order.items.map(i => ({
                menuItemId: i.menuItemId,
                quantity: i.quantity,
                notes: i.notes || undefined,
                modifiers: i.modifiers || undefined
            })), item];
        return this.ordersService.update(id, { items: updatedItems });
    }
    async removeItem(id, menuItemId) {
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
    async updateItemQuantity(id, menuItemId, quantity) {
        const order = await this.ordersService.findOne(id);
        const updatedItems = order.items.map(item => item.menuItemId === menuItemId
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
            });
        return this.ordersService.update(id, { items: updatedItems });
    }
    async syncTableStatuses() {
        await this.ordersService.syncTableStatuses();
        return { message: 'Table statuses synchronized successfully' };
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('table/:tableNumber'),
    __param(0, (0, common_1.Param)('tableNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findByTable", null);
__decorate([
    (0, common_1.Get)('table/:tableNumber/current'),
    __param(0, (0, common_1.Param)('tableNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getCurrentTableOrders", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_dto_1.UpdateOrderDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_dto_1.UpdateOrderStatusDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/items'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_dto_1.AddOrderItemDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "addItem", null);
__decorate([
    (0, common_1.Delete)(':id/items/:menuItemId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('menuItemId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "removeItem", null);
__decorate([
    (0, common_1.Patch)(':id/items/:menuItemId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('menuItemId')),
    __param(2, (0, common_1.Body)('quantity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "updateItemQuantity", null);
__decorate([
    (0, common_1.Post)('sync-table-statuses'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "syncTableStatuses", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map