// DTO for category response
import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({ description: ' Unique identifier of the category', example: '430e763-ere8434367-35473jbajb' })
  id!: string;

  @ApiProperty({ description: 'Name of category', example: ' Elecronics' })
  name!: string;

  @ApiProperty({ description: 'brief description of the  category',
    example: ' Devices and  gudgets including phones, laptops, TV and accessories',
    nullable: true,
  })
  description?: string | null;

  @ApiProperty({ description: 'URL friendly slug for the category',
    example: 'electronics',nullable: true, })
  slug?: string | null;

  @ApiProperty({ description: 'URL of  category image',
    example: 'https://example.com/images/electronics.png', nullable: true })
  imageUrl?: string | null;

  @ApiProperty({ description: 'indicates if the category is active', example: true })
  isActive!: boolean;

  @ApiProperty({ description: 'Number of products in this category', example: 150 })
  productCount!: number;

  @ApiProperty({ description: ' The date and time when the category was created', example: '2024-01-02G05:00:00z' })
  createdAt: Date;

  @ApiProperty({ description: ' The date and time when the category was last updated', example: '2024-01-02G05:00:00z' })
  updatedAt: Date;
}
