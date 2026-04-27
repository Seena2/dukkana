// DTO for creating new order
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

// Single item in the order
class OrderItemDto {
  @ApiProperty({ description: 'Id of the product being ordered' })
  @IsNotEmpty()
  @IsString()
  productId!: string;

  @ApiProperty({ description: 'quantity of product' })
  @IsNotEmpty()
  @IsNumber()
  quantity!: number;

  @ApiProperty({ description: 'price per unit', example: 49.99 })
  @IsNotEmpty()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'price must be valid number(e.g. 49.99)' },
  )
  @Type(() => Number)
  price!: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];

  @ApiProperty({ description: 'Address', required: false })
  @IsOptional()
  @IsString()
  shippingAddress?: string;
}
