import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { SearchMenuItemDto } from './dto/search-menu-item.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async create(createMenuItemDto: CreateMenuItemDto) {
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

  async findOne(id: string) {
    const menuItem = await this.prisma.menuItem.findFirst({
      where: { 
        id,
        deleted: false
      },
    });

    if (!menuItem) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }

    return menuItem;
  }

  async findByCategory(categoryId: string) {
    return this.prisma.menuItem.findMany({
      where: { 
        category: categoryId,
        deleted: false
      },
    });
  }

  async update(id: string, updateMenuItemDto: UpdateMenuItemDto) {
    try {
      return await this.prisma.menuItem.update({
        where: { 
          id,
          deleted: false
        },
        data: updateMenuItemDto,
      });
    } catch (error) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.menuItem.update({
        where: { id },
        data: { deleted: true }
      });
    } catch (error) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
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

  async search(searchParams: SearchMenuItemDto) {
    const where: Prisma.MenuItemWhereInput = {
      deleted: false
    };

    // If searchTerm is provided, search in name and description
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

    // Add specific field filters if provided
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
} 