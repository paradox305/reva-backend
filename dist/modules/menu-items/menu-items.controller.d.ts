import { MenuItemsService } from './menu-items.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { MenuItem } from '@prisma/client';
export declare class MenuItemsController {
    private readonly menuItemsService;
    constructor(menuItemsService: MenuItemsService);
    create(createMenuItemDto: CreateMenuItemDto): Promise<MenuItem>;
    findAll(category?: string, available?: string): Promise<MenuItem[]>;
    findOne(id: string): Promise<MenuItem | null>;
    update(id: string, updateMenuItemDto: Partial<CreateMenuItemDto>): Promise<MenuItem>;
    remove(id: string): Promise<MenuItem>;
}
