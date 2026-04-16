// DTO  for quering  and filtering the Products
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class QueryProductsDto {
  @ApiProperty({ description: 'filter by category', example: 'Electronics' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ description: 'Filter by active status', example: true })
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ description: 'search by product name',example: ' Headphones' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ description: 'Page number for pagination', example: 1, minimum: 1, default: 1 })
  @IsNumber()
  @Min(1)
  @Type(() => Number) //changes string to number type
  @IsOptional()
  page: number = 1;

  @ApiProperty({ description: 'Number of items per page', example: 10, minimum: 1, default: 10 })
  @IsNumber()
  @Min(1)
  @Type(() => Number) //changes string to number type
  @IsOptional()
  limit: number = 10;
}
