import { PrismaService } from '../../prisma/prisma.service';
import { MenuItem, Prisma } from '@prisma/client';
export declare class MenuItemsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.MenuItemCreateInput): Promise<MenuItem>;
    findAll(params?: {
        skip?: number;
        take?: number;
        where?: Prisma.MenuItemWhereInput;
        orderBy?: Prisma.MenuItemOrderByWithRelationInput;
    }): Promise<MenuItem[]>;
    findOne(id: string): Promise<MenuItem | null>;
    update(id: string, data: Prisma.MenuItemUpdateInput): Promise<MenuItem>;
    remove(id: string): Promise<MenuItem>;
}
