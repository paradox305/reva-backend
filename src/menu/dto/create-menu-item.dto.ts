import { IsString, IsNumber, IsBoolean, IsOptional, IsEnum, IsInt, Min } from 'class-validator';

export enum Department {
  BAR = 'BAR',
  KITCHEN = 'KITCHEN',
}

export class CreateMenuItemDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  price: number;

  @IsString()
  category: string;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean = true;

  @IsEnum(Department)
  department: Department;

  @IsInt()
  @Min(0)
  @IsOptional()
  inventoryCount?: number;
} 