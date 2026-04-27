// DTO for order response
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

// Generic order API response
export class OrderApiResponseDto<T> {
  @ApiProperty({ description: 'Indicates if the request was successfull' })
  success!: boolean;

  @ApiProperty({
    description: 'Returned data: the actual response payload',
    type: Object,
  })
  @IsOptional()
  @IsString()
  data!: T;

  @ApiProperty({
    description: 'additonal context, warning, errors',
    nullable: true,
    required: false,
  })
  message?: string;
}

//define single order item
export class OrderItemResponseDto {
  @ApiProperty({ description: 'Order item ID' })
  id!: string;

  @ApiProperty()
  productId!: string;

  @ApiProperty()
  productName!: string;

  @ApiProperty()
  quantity!: number;

  @ApiProperty()
  price!: number;

  @ApiProperty()
  subtotal!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

// expected DTO object as a response from an order
export class OrderResponseDto {
  @ApiProperty({ description: 'unique ID for the order' })
  id!: string;

  @ApiProperty({ description: ' ID of user who placed the order' })
  userId!: string;

  @ApiProperty({ description: 'order status', example: 'PENDING' })
  status!: string;

  @ApiProperty()
  total!: number;

  @ApiProperty()
  shippingAddress?: string;

  @ApiProperty({
    description: 'each items details: qty, price, etc',
    type: [OrderItemResponseDto],
  })
  items!: OrderItemResponseDto[];

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class PaginatedOrderResponseDto {
  @ApiProperty({ type: [OrderResponseDto] })
  data!: OrderResponseDto[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  limit!: number;
}
