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
exports.MenuController = void 0;
const common_1 = require("@nestjs/common");
const menu_service_1 = require("./menu.service");
const create_menu_item_dto_1 = require("./dto/create-menu-item.dto");
const update_menu_item_dto_1 = require("./dto/update-menu-item.dto");
const search_menu_item_dto_1 = require("./dto/search-menu-item.dto");
let MenuController = class MenuController {
    menuService;
    constructor(menuService) {
        this.menuService = menuService;
    }
    async create(createMenuItemDto) {
        return this.menuService.create(createMenuItemDto);
    }
    async findAll() {
        return this.menuService.findAll();
    }
    async search(searchParams) {
        return this.menuService.search(searchParams);
    }
    async findOne(id) {
        return this.menuService.findOne(id);
    }
    async findByCategory(categoryId) {
        return this.menuService.findByCategory(categoryId);
    }
    async getCategories() {
        return this.menuService.getCategories();
    }
    async update(id, updateMenuItemDto) {
        return this.menuService.update(id, updateMenuItemDto);
    }
    async remove(id) {
        await this.menuService.remove(id);
    }
};
exports.MenuController = MenuController;
__decorate([
    (0, common_1.Post)('items'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_menu_item_dto_1.CreateMenuItemDto]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('items'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_menu_item_dto_1.SearchMenuItemDto]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('items/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('categories/:categoryId/items'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "findByCategory", null);
__decorate([
    (0, common_1.Get)('categories'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Put)('items/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_menu_item_dto_1.UpdateMenuItemDto]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('items/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "remove", null);
exports.MenuController = MenuController = __decorate([
    (0, common_1.Controller)('menu'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __metadata("design:paramtypes", [menu_service_1.MenuService])
], MenuController);
//# sourceMappingURL=menu.controller.js.map