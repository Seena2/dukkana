import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

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
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return await this.categoryService.createNewCategory(createCategoryDto);
  }
  // Update  category(Admin only)
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update category (Admin only) ' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({
    status: 200,
    description: 'Category udpated successfully.',
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiResponse({ status: 409, description: 'Category slug already exists.' })
  async updateCategory(
    @Param('id') catId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return await this.categoryService.updateCategory(catId, updateCategoryDto);
  }

  // Delete Category(Admin only)
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete catagory(Admin only)' })
  @ApiResponse({
    status: 400,
    description: 'Can not delete category with products',
  })
  async deleteCategory(
    @Param('id') catId: string,
  ): Promise<{ message: string }> {
    return await this.categoryService.deleteCategory(catId);
  }

  // Get all categories
  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  // Pagenated response
  @ApiResponse({
    status: 200,
    description: 'List of categories retrieved successfully.',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/CategoryResponseDto' },
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            page: { type: 'number' },
            limit: { type: 'number' },
            totalPages: { type: 'number' },
          },
        },
      },
    },
  })
  async getAllCategories(@Query() queryDto: QueryCategoryDto) {
    return await this.categoryService.fetchAllCategory(queryDto);
  }

  // Get  category by Id
  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({
    status: 200,
    description: 'Category details.',
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  async getCategoryById(
    @Param('id') categoryId: string,
  ): Promise<CategoryResponseDto> {
    return await this.categoryService.fetchCategoryById(categoryId);
  }

  // Get  category by slug
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get category by slug' })
  @ApiResponse({
    status: 200,
    description: 'Category details.',
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  async getCategoryBySlug(
    @Param('slug') slug: string,
  ): Promise<CategoryResponseDto> {
    return await this.categoryService.fetchCategoryBySlug(slug);
  }
}
