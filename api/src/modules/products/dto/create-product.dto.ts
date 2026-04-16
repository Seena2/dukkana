// DTO for creating new product
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'Product name', example: 'Wireless Headphones', maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @ApiProperty({ description: 'Product description',
    example: ' High quality wireless headphones with noise cancelation', required: false, })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Product price in USD', example: 99.99, minimum: 0, })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number) //changes string to number type
  price!: number;

  @ApiProperty({ description: ' Stock quantity', example: 100, minimum: 0 })
  @IsNumber()
  @Min(0)
  @Type(() => Number) //changes string to number type
  stock!: number;

  @ApiProperty({ description: ' Stock keeping unit(sku)-unique product identifier', example: 'WH-001', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  sku!: string;

  @ApiProperty({ description: ' Product image URL', example: 'https://example.com/image.jpg', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ description: ' Product category',  example: 'Electronics', required: true })
  @IsString()
  categoryId!: string;

  @ApiProperty({ description: ' Product is active and available for purchase',
    example: true, default: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
