import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { Category, Prisma } from '@prisma/client';
import { QueryCategoryDto } from './dto/query-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  // format the response object with total number of products in this category
  private formatCategory(
    category: Category,
    productCount: number,
  ): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      description: category.description ?? null,
      slug: category.slug,
      imageUrl: category.imageUrl ?? null,
      isActive: category.isActive,
      productCount,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  //crate new category
  async createNewCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const { name, slug, ...rest } = createCategoryDto; //destructure values from incoming request object
    // construct slug from category name
    const categorySlug =
      slug ??
      name
        .toLocaleLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');
    // check if the category already exists
    const existingCategory = await this.prisma.category.findUnique({
      where: { slug: categorySlug },
    });
    if (existingCategory) {
      throw new Error(
        `Category with this slug already exists: ${categorySlug}`,
      );
    }
    const category = await this.prisma.category.create({
      data: { name, slug: categorySlug, ...rest },
    });
    return this.formatCategory(category, 0);
  }

  // Get all categories with optional filters and pagination
  async fetchAllCategory(queryDto: QueryCategoryDto): Promise<{
    data: CategoryResponseDto[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const { isActive, search, page = 1, limit = 10 } = queryDto; //destructure values from incoming request object
    // construct a where clause  to specify parameters for the query using prisma model
    const where: Prisma.CategoryWhereInput = {};
    if (isActive !== undefined) {
      where.isActive = isActive;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    const total = await this.prisma.category.count({ where }); // totl number of matching categories, for pagination
    // get all matching categories including related products
    const categories = await this.prisma.category.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { products: true }, //count each category
        },
      },
    });
    return {
      data: categories.map((category) =>
        this.formatCategory(category, category._count.products),
      ),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  //Get category by Id
  async fetchCategoryById(id: string): Promise<CategoryResponseDto> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return this.formatCategory(category, Number(category._count.products));
  }

  //Get category by slug
  async fetchCategoryBySlug(slug: string): Promise<CategoryResponseDto> {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: { _count: { select: { products: true } } },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return this.formatCategory(category, Number(category._count.products));
  }

  //Update category
  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }
    // Check if the slug is already used by another category to prevent duplicates
    if (
      updateCategoryDto.slug &&
      updateCategoryDto.slug !== existingCategory.slug
    ) {
      const slugTaken = await this.prisma.category.findUnique({
        where: { slug: updateCategoryDto.slug },
      });
      if (slugTaken) {
        throw new ConflictException(
          `Category with slug ${updateCategoryDto.slug} already exists`,
        );
      }
    }
    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
      include: { _count: { select: { products: true } } },
    });
    return this.formatCategory(
      updatedCategory,
      Number(updatedCategory._count.products),
    );
  }

  // Delete Category
  async deleteCategory(id: string): Promise<{ message: string }> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    // Check if the category has associted product, if so prevent deletion
    if (category._count.products > 0) {
      throw new BadRequestException(
        `Can not delete category with ${category._count.products} products. Remove or reasign products first`,
      );
    }
    // else if category is empty, delte the category
    await this.prisma.category.delete({ where: { id } });
    return { message: 'Category deleted succesfully' };
  }
}
