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
exports.MenuService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MenuService = class MenuService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createMenuItemDto) {
        return this.prisma.menuItem.create({
            data: createMenuItemDto,
        });
    }
    async findAll() {
        return this.prisma.menuItem.findMany({
            where: {
                deleted: false
            }
        });
    }
    async findOne(id) {
        const menuItem = await this.prisma.menuItem.findFirst({
            where: {
                id,
                deleted: false
            },
        });
        if (!menuItem) {
            throw new common_1.NotFoundException(`Menu item with ID ${id} not found`);
        }
        return menuItem;
    }
    async findByCategory(categoryId) {
        return this.prisma.menuItem.findMany({
            where: {
                category: categoryId,
                deleted: false
            },
        });
    }
    async update(id, updateMenuItemDto) {
        try {
            return await this.prisma.menuItem.update({
                where: {
                    id,
                    deleted: false
                },
                data: updateMenuItemDto,
            });
        }
        catch (error) {
            throw new common_1.NotFoundException(`Menu item with ID ${id} not found`);
        }
    }
    async remove(id) {
        try {
            await this.prisma.menuItem.update({
                where: { id },
                data: { deleted: true }
            });
        }
        catch (error) {
            throw new common_1.NotFoundException(`Menu item with ID ${id} not found`);
        }
    }
    async getCategories() {
        const items = await this.prisma.menuItem.findMany({
            select: {
                category: true,
            },
            distinct: ['category'],
        });
        return items.map((item, index) => ({
            id: index.toString(),
            name: item.category,
        }));
    }
    async search(searchParams) {
        const where = {
            deleted: false
        };
        if (searchParams.searchTerm) {
            where.OR = [
                {
                    name: {
                        contains: searchParams.searchTerm,
                        mode: 'insensitive',
                    },
                },
                {
                    description: {
                        contains: searchParams.searchTerm,
                        mode: 'insensitive',
                    },
                },
            ];
        }
        if (searchParams.name) {
            where.name = {
                contains: searchParams.name,
                mode: 'insensitive',
            };
        }
        if (searchParams.category) {
            where.category = {
                equals: searchParams.category,
                mode: 'insensitive',
            };
        }
        if (searchParams.department) {
            where.department = searchParams.department;
        }
        return this.prisma.menuItem.findMany({
            where,
            orderBy: {
                name: 'asc',
            },
        });
    }
};
exports.MenuService = MenuService;
exports.MenuService = MenuService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MenuService);
//# sourceMappingURL=menu.service.js.map