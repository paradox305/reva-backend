import { IsString, IsOptional, IsEnum } from 'class-validator';
import { Department } from './create-menu-item.dto';

export class SearchMenuItemDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsEnum(Department)
  @IsOptional()
  department?: Department;

  @IsString()
  @IsOptional()
  searchTerm?: string;
} 