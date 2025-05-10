import { Department } from '@prisma/client';
export declare class CreateMenuItemDto {
    name: string;
    description?: string;
    price: number;
    category: string;
    department?: Department;
}
