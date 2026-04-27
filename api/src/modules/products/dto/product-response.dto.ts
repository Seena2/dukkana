// DTO for Product Response
import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({
    description: 'Product ID',
    example: '46545646sds-4584s68sd-4654684sd',
  })
  id!: string;

  @ApiProperty({ description: 'Product name', example: 'Wireless headphone' })
  name!: string;

  @ApiProperty({
    description: 'Product description',
    example: ' High quality wireless headphones with noise cancelation',
    nullable: true,
  })
  description?: string | null;

  @ApiProperty({ description: 'Product price in USD', example: 99.99 })
  price!: number;

  @ApiProperty({ description: ' product in stock', example: 100 })
  stock!: number;

  @ApiProperty({ description: ' Stock keeping unit', example: 'WH-001' })
  sku!: string;

  @ApiProperty({
    description: ' Product image URL',
    example: 'https://example.com/image.jpg',
  })
  imageUrl?: string | null;

  @ApiProperty({ description: ' Product category', example: 'Electronics' })
  category?: string | null;

  @ApiProperty({ description: ' Product availablity', example: true })
  isActive?: boolean;

  @ApiProperty({ description: ' Creation timestamp' })
  createdAt!: Date;

  @ApiProperty({ description: ' last update timestamp' })
  updatedAt!: Date;
}
