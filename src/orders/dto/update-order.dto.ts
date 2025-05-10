import { OrderStatus, OrderType } from '@prisma/client';
import { IsString, IsOptional, IsEnum, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateOrderItemDto {
  @IsString()
  @IsOptional()
  id?: string;

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

export class AddOrderItemDto {
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

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

export class UpdateOrderDto {
  @IsString()
  @IsOptional()
  tableNumber?: string;

  @IsString()
  @IsOptional()
  roomNumber?: string;

  @IsEnum(OrderType)
  @IsOptional()
  orderType?: OrderType;

  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @ValidateNested({ each: true })
  @Type(() => UpdateOrderItemDto)
  @IsOptional()
  items?: UpdateOrderItemDto[];

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsOptional()
  paymentStatus?: boolean;
} 