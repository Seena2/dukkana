import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  // ADMIN ROUTEs
  //Create new Product(Admin only)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create new product (Admin only)' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Product created successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 403, description: ' Forbidden, Admin role required' })
  @ApiResponse({ status: 409, description: 'sku already exists' })
  async createProduct(@Body() createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    return await this.productsService.createNewProduct(createProductDto);
  }

  // Update product(admin route)
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update existing product (Admin only)' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({status: 200, description: 'Product updated successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 409, description: ' sku already exists' })
  async updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Promise<ProductResponseDto> {
    return await this.productsService.updateProduct(id, updateProductDto);
  }

  // Update product stock(admin route)
  @Patch(':id/stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update product quantity in stock (Admin only)' })
  @ApiBody({
    schema: { type: 'object', properties: {
        quantity: { type: 'number', description: 'stock adjustment(Positive to add, negative to substract)', example: 10}},
      required: ['quantity'],
    }, })
  @ApiResponse({status: 200, description: 'Stock updated successfully', type: ProductResponseDto})
  @ApiResponse({ status: 400, description: 'Insufficient stock' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async updateStock(@Param('id') id: string, @Body('quantity') quantity: number): Promise<ProductResponseDto> {
    return await this.productsService.updateStock(id, quantity);
  }

  // Delete product (admin only)
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete product (Admin only)' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 400, description: 'Can not delete product in active orders' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async deleteProduct(@Param('id') id: string): Promise<{ message: string }> {
    return await this.productsService.deleteProduct(id);
  }

  //Get all Products
  @Get()
  @ApiOperation({ summary: 'fetches all products with optional filters' })
  @ApiResponse({ status: 200, description: ' List of products with pagination',
    schema: { type: 'object', properties: { 
        data: {type: 'array', items: {$ref:'#/components/schemas/ProductResponseDto'} },
        meta: {type: 'object', properties: {total: {type: 'number'}, page: {type: 'number'},
            limit:{ type: 'number'}, totalPages:{ type: 'number'}  }}
      },
    },
  })
  async getAllProducts(@Query() queryProductDto: QueryProductsDto) {
    return await this.productsService.fetchAllProduct(queryProductDto);
  }

  //Get Product by ID
  @Get(':id')
  @ApiOperation({ summary: 'fetches products by ID' })
  @ApiResponse({ status: 200, description: ' Product details', type : ProductResponseDto})
  @ApiResponse({ status: 404, description: ' Product not found' })
  async getOneProductById(@Param('id') id: string): Promise<ProductResponseDto> {
    return await this.productsService.fetchProductById(id);
  }
}
