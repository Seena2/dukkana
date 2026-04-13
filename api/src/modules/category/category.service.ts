import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { Category, Prisma } from '@prisma/client';
import { QueryCategoryDto } from './dto/query-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  // format the response object with total number of products in this category
  private formatCategory(category: Category, productCount: number): CategoryResponseDto {
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
  async createNewCategory( createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const { name, slug, ...rest } = createCategoryDto; //destructure values from incoming request object
    // create slug
    const categorySlug = slug ?? name.toLocaleLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    // check if the category already exists
    const existingCategory = await this.prisma.category.findUnique({ where: {slug: categorySlug }, });
    if (existingCategory) {
      throw new Error(' Category with this slug already exists: ' + categorySlug );
    }
    const category = await this.prisma.category.create({ data: { name, slug: categorySlug, ...rest } });
    return this.formatCategory(category, 0);
  }

  // Get all categories with optional filters and pagination
  async fetchAllCategory(queryDto: QueryCategoryDto): Promise<{
    data: CategoryResponseDto[];
    meta: { total: number; page: number; limit: number; totalPages: number }; }> {
    const { isActive, search, page = 1, limit = 10 } = queryDto; //destructure values from incoming request object
    // construct a where clause  to specify parameters for the query using prisma model
    const where: Prisma.CategoryWhereInput = {};
    if (isActive !== undefined) {
      where.isActive = isActive;
    }
    if (search) {
      where.OR = [ { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }, ];
    }
    const totalNumberOfMatchingCategories = await this.prisma.category.count({ where }); //for pagination
    // get all matching categories
    const categories = await this.prisma.category.findMany({ where, skip: (page - 1) * limit, take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { products: true }, //count each category
        },
      },
    });
    return {
      data: categories.map((category) => this.formatCategory(category, category._count.products)),
      meta: { totalNumberOfMatchingCategories, page, limit, totalPages: Math.ceil(totalNumberOfMatchingCategories / limit),
      },
    };
  }

  //Get category by Id
  async fetchOneCategory(id: string): Promise<CategoryResponseDto> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });
    return this.formatCategory(category, 0);
  }
}
