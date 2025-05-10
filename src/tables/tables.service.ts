import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Table, Prisma } from '@prisma/client';

@Injectable()
export class TablesService {
  constructor(private prisma: PrismaService) {}

  async createTable(data: Prisma.TableCreateInput): Promise<Table> {
    return this.prisma.table.create({
      data,
    });
  }

  async getTables(): Promise<Table[]> {
    return this.prisma.table.findMany();
  }

  async getTableById(id: number): Promise<Table | null> {
    return this.prisma.table.findUnique({
      where: { id },
    });
  }

  async getTableByNumber(number: number): Promise<Table | null> {
    return this.prisma.table.findUnique({
      where: { number },
    });
  }
} 