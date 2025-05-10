import { PrismaService } from '../../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.UserCreateInput): Promise<User>;
    findAll(): Promise<Omit<User, 'password'>[]>;
    findOne(id: string): Promise<Omit<User, 'password'> | null>;
    findByEmail(email: string): Promise<User | null>;
    update(id: string, data: Prisma.UserUpdateInput): Promise<User>;
    remove(id: string): Promise<User>;
}
