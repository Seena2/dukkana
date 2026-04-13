import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { QueryCategoryDto } from './dto/query-category.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // ADMIN ROUTES
  // Create New Category
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth') //security scheme/strategy we want to use
  @ApiOperation({ summary: 'Create new category' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ status: 201, description: 'Category created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Unauthorized.' })
  async createCategory( createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
    return await this.categoryService.createNewCategory(createCategoryDto);
  }

  // Get all categories
  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  // Pagenated response
  @ApiResponse({ status: 200, description: 'List of categories retrieved successfully.',
    schema: { type: 'object', properties: {
        data: {  type: 'array', items: { $ref: '#/components/schemas/CategoryResponseDto'} },
        meta: { type: 'object', properties: {
            total: { type: 'number' }, page: { type: 'number' }, limit: { type: 'number' }, totalPages: { type: 'number' },
          },
        },
      },
    },
  })
  async getAllCategories(@Query() queryDto: QueryCategoryDto) {
    return await this.categoryService.fetchAllCategory(queryDto);
  }

  // Get  categories by Id
  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({ status: 200, description: 'Category details.',  type: CategoryResponseDto })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  async getOneCategory(@Param('id') categoryId: string): Promise<CategoryResponseDto> {
    return await this.categoryService.fetchOneCategory(categoryId);
  }
}
