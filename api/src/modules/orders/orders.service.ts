import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create_orders.dto';
import {
  OrderApiResponseDto,
  OrderResponseDto,
} from './dto/order-response.dto';
import { Order, OrderItem, OrderStatus, Product, User } from '@prisma/client';
import { QueryOrderDto } from './dto/query_orders.dto';
import { UpdateOrderDto } from './dto/update_order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // Helper function to format and order the returned object
  private organize(
    order: Order & {
      orderItems: (OrderItem & { product: Product })[];
      user: User;
    },
  ): OrderResponseDto {
    return {
      id: order.id,
      userId: order.userId,
      status: order.status,
      total: Number(order.totalAmount),
      shippingAddress: order.shippingAddress ?? '',
      items: order.orderItems.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        price: Number(item.price),
        subtotal: Number(item.price) * item.quantity,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      })),
      ...(order.user && {
        userEmail: order.user.email,
        userName:
          `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim(),
      }),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
  private wrap(
    order: Order & {
      orderItems: (OrderItem & { product: Product })[];
      user: User;
    },
  ): OrderApiResponseDto<OrderResponseDto> {
    return {
      success: true,
      message: 'Order retreived successfully',
      data: this.organize(order),
    };
  }

  //Create new order
  async createNewOrder(
    userId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<OrderApiResponseDto<OrderResponseDto>> {
    const { items, shippingAddress } = createOrderDto;
    // Check if product item in the order is available for order/purchase : in kind and quantity
    for (const item of items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (!product) {
        throw new NotFoundException(
          `Product with ID "${item.productId}" is not found`,
        );
      }
      //  check if there is enough stock for the order
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
        );
      }
    }
    // calculate total amount
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    // get cart for not checkedout user
    const latestCart = await this.prisma.cart.findFirst({
      where: { userId, checkedOut: false },
      orderBy: { createdAt: 'desc' },
    });
    // Create the order
    const order = await this.prisma.$transaction(async (tsx) => {
      const newOrder = await tsx.order.create({
        data: {
          userId,
          status: OrderStatus.PENDING,
          totalAmount: total,
          shippingAddress,
          cartId: latestCart?.id,
          orderItems: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: { orderItems: { include: { product: true } }, user: true },
      });
      // reduce/decrement the stock to maintain accurate inventory
      for (const item of items) {
        await tsx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
      return newOrder;
    });
    return this.wrap(order);
  }

  // Update order( ADMIN & USER)
  async updateOrderById(
    orderId: string,
    updateOrderDto: UpdateOrderDto,
    userId?: string,
  ): Promise<OrderApiResponseDto<OrderResponseDto>> {
    const where: any = { orderId };
    if (userId) where.userId = userId;
    const existingOrder = await this.prisma.order.findFirst({ where });
    if (!existingOrder) {
      throw new NotFoundException(`Order with Id ${orderId} is not found`);
    }
    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: updateOrderDto,
      include: { orderItems: { include: { product: true } }, user: true },
    });
    return this.wrap(updatedOrder);
  }

  // Cancel order( ADMIN & USER)
  async cancelOrderById(
    orderId: string,
    userId?: string,
  ): Promise<OrderApiResponseDto<OrderResponseDto>> {
    const where: any = { orderId };
    if (userId) where.userId = userId;
    const order = await this.prisma.order.findFirst({
      where,
      include: { orderItems: true, user: true },
    });
    if (!order) {
      throw new NotFoundException(`Order with Id ${orderId} is not found`);
    }
    // only Pending request can be cancelled
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only pending order can be cancelled');
    }
    // update status to Cancelled, increment the stock for each product with cancelled qty amount
    const cancelledOrder = await this.prisma.$transaction(async (tsx) => {
      for (const item of order.orderItems) {
        await tsx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
      return tsx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CANCELLED },
        include: { orderItems: { include: { product: true } }, user: true },
      });
    });

    return this.wrap(cancelledOrder);
  }
  // Fetch all  orders for Current user:
  async fetchAllMyOrders(
    userId: string,
    queryOrdersDto: QueryOrderDto,
  ): Promise<{
    data: OrderResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, status, search } = queryOrdersDto;
    // offset: how many records to skip/offset for pagination
    const skip = (page - 1) * limit;
    // construct dynamic where, where the conditions are added dynamically if exists
    const where: any = { userId };
    if (status) where.status = status;
    //  case insensative search condition on Id  when seatch term exists
    if (search) where.OR = [{ id: { contains: search, mode: 'insensitive' } }];

    // "Promise.all" executes two DB queries in parallel to get the values for orders & total
    const [orders, total] = await Promise.all([
      // fetch pagianted orders including related order items and associted user
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: { orderItems: { include: { product: true } }, user: true },
        orderBy: { createdAt: 'desc' },
      }),
      // count total number of orders for pagination
      this.prisma.order.count({ where }),
    ]);
    // format/organize fetched raw data from DB into OrdersResponseDTo object
    return { data: orders.map((o) => this.organize(o)), total, page, limit };
  }

  // Fetch all orders for admin purpose: returns a promise of object and metadata for pagiantion
  async fetchAllOrders(queryOrdersDto: QueryOrderDto): Promise<{
    data: OrderResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, status, search } = queryOrdersDto;
    // offset: how many records to skip/offset for pagination
    const skip = (page - 1) * limit;
    // construct dynamic where, where the conditions are added dynamically
    const where: any = {};
    if (status) where.status = status;
    // set case insensative search condition on Id or order number when seatch term exists
    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { orderNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    // "Promise.all" executes two DB queries in parallel to get the values for orders & total
    const [orders, total] = await Promise.all([
      // fetch pagianted orders including related order items and associted user
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: { orderItems: { include: { product: true } }, user: true },
        orderBy: { createdAt: 'desc' },
      }),
      // count total number of orders for pagination
      this.prisma.order.count({ where }),
    ]);
    // format/organize fetched raw data from DB into OrdersResponseDTo object
    return { data: orders.map((o) => this.organize(o)), total, page, limit };
  }

  // Get order by Id ( ADMIN & USER)
  async fetchOrderById(
    orderId: string,
    userId?: string,
  ): Promise<OrderApiResponseDto<OrderResponseDto>> {
    const where: any = { orderId };
    if (userId) where.userId = userId;
    const order = await this.prisma.order.findFirst({
      where,
      include: { orderItems: { include: { product: true } }, user: true },
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    return this.wrap(order);
  }
}
