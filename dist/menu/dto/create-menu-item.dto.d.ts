export declare enum Department {
    BAR = "BAR",
    KITCHEN = "KITCHEN"
}
export declare class CreateMenuItemDto {
    name: string;
    description?: string;
    price: number;
    category: string;
    isAvailable?: boolean;
    department: Department;
}
