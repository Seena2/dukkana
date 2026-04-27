import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { Category, Prisma, Product } from '@prisma/client';
import { QueryProductsDto } from './dto/query-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  //  Format the returned product object
  private formatProduct(
    product: Product & { category: Category },
  ): ProductResponseDto {
    return {
      ...product,
      price: Number(product.price),
      category: product.category.name,
    };
  }
  // ADMIN ROUTES
  //Create new product(admin only)
  async createNewProduct(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const { sku, price } = createProductDto;
    const SkuAlradyExist = await this.prisma.product.findUnique({
      where: { sku },
    });
    if (SkuAlradyExist) {
      throw new ConflictException(`Product with SKU "${sku}" already exists`);
    }
    const product = await this.prisma.product.create({
      data: { ...createProductDto, price: new Prisma.Decimal(price) },
      include: { category: true },
    });
    return this.formatProduct(product);
  }

  //update product(admin only)
  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }
    // ckeck if the new sku is d/t from existing product sku and if sku is already taken by another product
    if (updateProductDto.sku && updateProductDto.sku !== existingProduct.sku) {
      const skuTaken = await this.prisma.product.findUnique({
        where: { sku: updateProductDto.sku },
      });
      if (skuTaken) {
        throw new ConflictException(
          `Product with SKU ${updateProductDto.sku} already exists`,
        );
      }
    }
    const updateData: any = { ...updateProductDto };
    if (updateProductDto && updateProductDto.price !== undefined) {
      updateData.price = new Prisma.Decimal(updateProductDto.price);
    }
    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: updateData,
      include: { category: true },
    });
    return this.formatProduct(updatedProduct);
  }

  // Update product stock quantity
  async updateStock(id: string, quantity: number): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const newStockQuantity = product.stock + quantity; //updates the stock quantity
    if (newStockQuantity < 0) {
      throw new BadRequestException('Insufficeint stock');
    }
    // set new stock value in the DB
    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: { stock: newStockQuantity },
      include: { category: true },
    });
    return this.formatProduct(updatedProduct);
  }

  // Delete product
  async deleteProduct(id: string): Promise<{ message: string }> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { orderItems: true, cartItems: true },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    // if product is ordererd or in the cart prevent deletion
    if (product.orderItems.length > 0) {
      throw new BadRequestException(
        ' Cannot delete product that is part of existing order. consider marking it as inactive',
      );
    }
    await this.prisma.product.delete({ where: { id } });
    return { message: 'Product deleted successfully' };
  }

  //Get all products
  async fetchAllProduct(queryProductDto: QueryProductsDto): Promise<{
    data: ProductResponseDto[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const {
      category,
      isActive,
      search,
      page = 1,
      limit = 10,
    } = queryProductDto;
    // Constract the dynamic where condition
    const where: Prisma.ProductWhereInput = {};
    if (category) {
      where.categoryId = category;
    }
    if (isActive !== undefined) {
      where.isActive = isActive;
    }
    //if search term is found, perform case insensative search on product name and description
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    // count total number of products retrieved, for pagination
    const total = await this.prisma.product.count({ where });
    const products = await this.prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });
    return {
      data: products.map((product) => this.formatProduct(product)),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // Get product by Id
  async fetchProductById(id: string): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) {
      throw new NotFoundException(' Product not found');
    }
    return this.formatProduct(product);
  }
}
