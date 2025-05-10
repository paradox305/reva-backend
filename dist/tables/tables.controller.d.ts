import { TablesService } from './tables.service';
interface CreateTableDto {
    number: number;
    capacity: number;
}
export declare class TablesController {
    private readonly tablesService;
    constructor(tablesService: TablesService);
    createTable(createTableDto: CreateTableDto): Promise<{
        id: number;
        number: number;
        capacity: number;
        isOccupied: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getTables(): Promise<{
        id: number;
        number: number;
        capacity: number;
        isOccupied: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getTableById(id: number): Promise<{
        id: number;
        number: number;
        capacity: number;
        isOccupied: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    getTableByNumber(number: number): Promise<{
        id: number;
        number: number;
        capacity: number;
        isOccupied: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
}
export {};
