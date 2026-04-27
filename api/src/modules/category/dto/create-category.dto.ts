// DTO for creating new category
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Name of the category',
    example: 'Electronics',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    description: 'brief description of the  category',
    example:
      ' Devices and  gudgets including phones, laptops, TV and accessories',
    required: false,
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @ApiProperty({
    description: 'URL friendly slug for the category',
    required: false,
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  slug?: string;

  @ApiProperty({
    description: 'URL of  category image',
    example: 'https://example.com/images/electronics.png',
    required: false,
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  imageUrl?: string;

  @ApiProperty({
    description: 'indicates if the category is active',
    example: true,
    required: false,
    maxLength: 255,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  @MaxLength(255)
  isActive?: boolean;
}
