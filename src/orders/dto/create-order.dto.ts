import { OrderType } from '@prisma/client';
import { IsString, IsOptional, IsEnum, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @IsString()
  menuItemId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  modifiers?: string;
}

export class CreateOrderDto {
  @IsString()
  tableNumber: string;

  @IsString()
  @IsOptional()
  roomNumber?: string;

  @IsEnum(OrderType)
  orderType: OrderType;

  @IsString()
  @IsOptional()
  userId?: string;

  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @IsString()
  @IsOptional()
  notes?: string;
} 