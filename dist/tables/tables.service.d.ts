import { PrismaService } from '../prisma/prisma.service';
import { Table, Prisma } from '@prisma/client';
export declare class TablesService {
    private prisma;
    constructor(prisma: PrismaService);
    createTable(data: Prisma.TableCreateInput): Promise<Table>;
    getTables(): Promise<Table[]>;
    getTableById(id: number): Promise<Table | null>;
    getTableByNumber(number: number): Promise<Table | null>;
}
