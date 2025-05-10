import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { SearchMenuItemDto } from './dto/search-menu-item.dto';

@Controller('menu')
@UsePipes(new ValidationPipe({ transform: true }))
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post('items')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMenuItemDto: CreateMenuItemDto) {
    return this.menuService.create(createMenuItemDto);
  }

  @Get('items')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.menuService.findAll();
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  async search(@Query() searchParams: SearchMenuItemDto) {
    return this.menuService.search(searchParams);
  }

  @Get('items/:id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return this.menuService.findOne(id);
  }

  @Get('categories/:categoryId/items')
  @HttpCode(HttpStatus.OK)
  async findByCategory(@Param('categoryId') categoryId: string) {
    return this.menuService.findByCategory(categoryId);
  }

  @Get('categories')
  @HttpCode(HttpStatus.OK)
  async getCategories() {
    return this.menuService.getCategories();
  }

  @Put('items/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
  ) {
    return this.menuService.update(id, updateMenuItemDto);
  }

  @Delete('items/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.menuService.remove(id);
  }
} 