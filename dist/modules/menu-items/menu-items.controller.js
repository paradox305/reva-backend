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
exports.MenuItemsController = void 0;
const common_1 = require("@nestjs/common");
const menu_items_service_1 = require("./menu-items.service");
const create_menu_item_dto_1 = require("./dto/create-menu-item.dto");
let MenuItemsController = class MenuItemsController {
    menuItemsService;
    constructor(menuItemsService) {
        this.menuItemsService = menuItemsService;
    }
    async create(createMenuItemDto) {
        return this.menuItemsService.create(createMenuItemDto);
    }
    async findAll(category, available) {
        const where = {};
        if (category) {
            where.category = category;
        }
        if (available !== undefined) {
            where.isAvailable = available === 'true';
        }
        return this.menuItemsService.findAll({
            where,
        });
    }
    async findOne(id) {
        return this.menuItemsService.findOne(id);
    }
    async update(id, updateMenuItemDto) {
        return this.menuItemsService.update(id, updateMenuItemDto);
    }
    async remove(id) {
        return this.menuItemsService.remove(id);
    }
};
exports.MenuItemsController = MenuItemsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_menu_item_dto_1.CreateMenuItemDto]),
    __metadata("design:returntype", Promise)
], MenuItemsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('available')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MenuItemsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MenuItemsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MenuItemsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MenuItemsController.prototype, "remove", null);
exports.MenuItemsController = MenuItemsController = __decorate([
    (0, common_1.Controller)('menu-items'),
    __metadata("design:paramtypes", [menu_items_service_1.MenuItemsService])
], MenuItemsController);
//# sourceMappingURL=menu-items.controller.js.map