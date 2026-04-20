import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { OrdersService } from './orders.service';
import {
  ModerateThrottle,
  RelaxedThrottle,
} from 'src/common/decorators/custom_throttler.decorator';
import { CreateOrderDto } from './dto/create_orders.dto';
import {
  OrderApiResponseDto,
  OrderResponseDto,
  PaginatedOrderResponseDto,
} from './dto/order-response.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { QueryOrderDto } from './dto/query_orders.dto';
import { UpdateOrderDto } from './dto/update_order.dto';

@ApiTags('orders')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  //REGULAR USER
  // Create new order
  @Post()
  @ModerateThrottle()
  @ApiOperation({ summary: 'Create new order' })
  @ApiBody({ type: CreateOrderDto })
  @ApiCreatedResponse({
    description: 'Order created successfully',
    type: OrderApiResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid data or insufficeint stock' })
  @ApiNotFoundResponse({ description: 'Cart not found or empty' })
  @ApiTooManyRequestsResponse({
    description: 'Too many request- rate limit exceeded',
  })
  async createOrder(
    @GetUser('id') userId: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return await this.ordersService.createNewOrder(userId, createOrderDto);
  }

  // Update order by id(own)
  @Patch(':id')
  @ModerateThrottle()
  @ApiOperation({ summary: 'update own order' })
  @ApiParam({ name: 'id', description: 'Order Id' })
  @ApiBody({ type: UpdateOrderDto })
  @ApiOkResponse({ description: 'Order updated successfully' })
  @ApiNotFoundResponse({ description: 'Order not found' })
  async updateMyOrder(
    @Param('id') orderId: string,
    @Body() updateData: UpdateOrderDto,
    @GetUser('id') userId: string,
  ) {
    return await this.ordersService.updateOrderById(
      orderId,
      updateData,
      userId,
    );
  }
  // Cancel own order by Id (user)
  @Delete(':id')
  @ModerateThrottle()
  @ApiOperation({ summary: 'User cancel his own order by Id' })
  @ApiParam({ name: 'id', description: 'Order Id' })
  @ApiBody({ type: UpdateOrderDto })
  @ApiOkResponse({
    description: 'Order cancelled successfully',
    type: OrderApiResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Order not found' })
  async cancelMyOrder(
    @Param('id') orderId: string,
    @GetUser('id') userId: string,
  ) {
    return await this.ordersService.cancelOrderById(orderId, userId);
  }

  // Get all orders for current user
  @Get()
  @RelaxedThrottle()
  @ApiOperation({ summary: 'Get all current user orders(Paginated)' })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiOkResponse({
    description: 'List of user orders',
    type: PaginatedOrderResponseDto,
  })
  async getAllMyOrders(
    @GetUser('id') userId: string,
    @Query() queryOrders: QueryOrderDto,
  ) {
    return await this.ordersService.fetchAllMyOrders(userId, queryOrders);
  }

  // Get own order by ID for current user
  @Get(':id')
  @RelaxedThrottle()
  @ApiOperation({ summary: 'Get order by id for current user' })
  @ApiParam({ name: 'id', description: 'Order Id' })
  @ApiOkResponse({ description: 'Order details', type: OrderApiResponseDto })
  @ApiNotFoundResponse({ description: 'Order not found' })
  async getOrderById(
    @Param('id') orderId: string,
    @GetUser('id') userId: string,
  ) {
    return await this.ordersService.fetchOrderById(orderId, userId);
  }

  // ADMIN ROUTES
  // Get all orders(admin user)
  @Get('admin/all')
  @Roles(Role.ADMIN)
  @RelaxedThrottle()
  @ApiOperation({ summary: 'Get all users(Paginated)- admin only' })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    description: 'List of orders',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(OrderResponseDto) },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  async getAllOrdersForAdmin(@Query() queryOrders: QueryOrderDto) {
    return await this.ordersService.fetchAllOrders(queryOrders);
  }

  // Get  order by ID(ADMIN user)
  @Get('admin/:id')
  @Roles(Role.ADMIN)
  @RelaxedThrottle()
  @ApiOperation({ summary: '[ADMIN] :Get order by id(admin only)' })
  @ApiParam({ name: 'id', description: 'Order Id' })
  @ApiOkResponse({ description: 'Order details', type: OrderApiResponseDto })
  @ApiNotFoundResponse({ description: 'Order not found' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  async getOrderByIdAdmin(@Param('id') orderId: string) {
    return await this.ordersService.fetchOrderById(orderId);
  }

  // Update order(ADMIN)
  @Patch('/admin/:id')
  @Roles(Role.ADMIN)
  @ModerateThrottle()
  @ApiOperation({ summary: '[ADMIN] update order' })
  @ApiParam({ name: 'id', description: 'Order Id' })
  @ApiBody({ type: UpdateOrderDto })
  @ApiOkResponse({
    description: 'Order updated successfully',
    type: OrderApiResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Order not found' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  async updateOrderAdmin(
    @Param('id') orderId: string,
    @Body() updateData: UpdateOrderDto,
  ) {
    return await this.ordersService.updateOrderById(orderId, updateData);
  }

  // Cancel order by Id (ADMIN)
  @Delete('/admin/:id')
  @Roles(Role.ADMIN)
  @ModerateThrottle()
  @ApiOperation({ summary: '[ADMIN] Cancel order by Id' })
  @ApiParam({ name: 'id', description: 'Order Id' })
  @ApiOkResponse({
    description: 'Order cancelled successfully',
    type: OrderApiResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Order not found' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  async cancelOrderAdmin(@Param('id') orderId: string) {
    return await this.ordersService.cancelOrderById(orderId);
  }
}
