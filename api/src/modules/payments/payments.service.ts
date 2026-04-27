import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import Stripe from 'stripe';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { PaymentStatus, Prisma } from '@prisma/client';
import { ConfirmPaymentDto } from './dto/confirm_payment.dto';
import { PaymentResponseDto } from './dto/payment_response.dto';

@Injectable()
export class PaymentsService {
  private stripe: Stripe.Stripe;
  constructor(private prisma: PrismaService) {
    // Intialize stripe to handle payments
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-03-25.dahlia',
    });
  }

  //Helper function to  transform and format the response object to match the expected structure
  private mapToPaymentResponse(payment: {
    id: string;
    orderId: string;
    userId: string;
    amount: Prisma.Decimal;
    currency: string;
    status: PaymentStatus;
    paymentMethod: string | null;
    transactionId: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): PaymentResponseDto {
    return {
      id: payment.id,
      orderId: payment.orderId,
      userId: payment.userId,
      currency: payment.currency,
      amount: payment.amount.toNumber(),
      status: payment.status,
      paymentMethod: payment.paymentMethod,
      transactionId: payment.transactionId,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }

  // Create payment intent
  async createPaymentIntent(
    userId: string,
    createPaymentIntentDto: CreatePaymentIntentDto,
  ): Promise<{
    success: boolean;
    data: { clientSecret: string; paymentId: string };
    message: string;
  }> {
    const { orderId, amount, currency = 'usd' } = createPaymentIntentDto;
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
    });
    if (!order) {
      throw new NotFoundException(`Order with Id ${orderId} is not found`);
    }
    // check if payment is already made to prevent duplicate charges
    const isPaymentCompleted = await this.prisma.payment.findFirst({
      where: { id: orderId },
    });
    if (
      isPaymentCompleted &&
      isPaymentCompleted.status === PaymentStatus.COMPLETED
    ) {
      throw new BadRequestException('Payment already completed for this order');
    }
    // Create payment intent for stripe
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata: { orderId, userId },
    });
    // create payment entry on the db
    const payment = await this.prisma.payment.create({
      data: {
        orderId,
        userId,
        amount,
        currency,
        status: PaymentStatus.PENDING,
        paymentMethod: 'STIPE',
        transactionId: paymentIntent.id,
      },
    });
    return {
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret!,
        paymentId: payment.id,
      },
      message: 'Payment intent created successfully',
    };
  }

  // Confirm payment
  async confirmPayment(
    userId: string,
    confirmPaymentDto: ConfirmPaymentDto,
  ): Promise<{
    success: boolean;
    data: PaymentResponseDto;
    message: string;
  }> {
    const { paymentIntentId, orderId } = confirmPaymentDto;
    // Check if the payment intent exists
    const payment = await this.prisma.payment.findFirst({
      where: { orderId, userId, transactionId: paymentIntentId },
    });
    if (!payment) {
      throw new NotFoundException(`Payment Not Found`);
    }
    // ensure the payment is NOT already Completed
    if (payment.status === PaymentStatus.COMPLETED) {
      throw new BadRequestException(` Payment already completed`);
    }
    // get payment intent to verify if payment is success
    const paymentIntent =
      await this.stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
      throw new BadRequestException(`Payment failed`);
    }
    // update payment from pending to completed, and mark order as Processing
    const [updatedPayment] = await this.prisma.$transaction([
      this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.COMPLETED },
      }),
      this.prisma.order.update({
        where: { id: orderId },
        data: { status: 'PROCESSING' },
      }),
    ]);
    const order = await this.prisma.order.findFirst({ where: { id: orderId } });
    // mark the cart associated with order to checked out
    if (order?.cartId) {
      await this.prisma.cart.update({
        where: { id: order.cartId },
        data: { checkedOut: true },
      });
    }
    return {
      success: true,
      data: this.mapToPaymentResponse(updatedPayment),
      message: 'Payment confirmed successfully',
    };
  }

  // Get all payments for current user
  async fetchAllPayments(userId: string): Promise<{
    success: boolean;
    data: PaymentResponseDto[];
    message: string;
  }> {
    const payments = await this.prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return {
      success: true,
      data: payments.map((payment) => this.mapToPaymentResponse(payment)),
      message: 'Payments recieved successfully',
    };
  }

  // Get single payment by id for current user
  async fetchPaymentById(
    paymentId: string,
    userId: string,
  ): Promise<{
    success: boolean;
    data: PaymentResponseDto;
    message: string;
  }> {
    const payment = await this.prisma.payment.findFirst({
      where: { id: paymentId, userId },
    });
    if (!payment) {
      throw new NotFoundException(`Payment with ${paymentId} is not found`);
    }
    return {
      success: true,
      data: this.mapToPaymentResponse(payment),
      message: 'Payment recieved successfully',
    };
  }

  // Get payment by Order ID
  async fetchPaymentByOrderId(
    orderId: string,
    userId: string,
  ): Promise<{
    success: boolean;
    data: PaymentResponseDto | null;
    message: string;
  }> {
    const payment = await this.prisma.payment.findFirst({
      where: { orderId, userId },
    });
    if (!payment) {
      throw new NotFoundException(`Payment with ${orderId} is not found`);
    }
    return {
      success: true,
      data: payment ? this.mapToPaymentResponse(payment) : null,
      message: 'Payment recieved successfully',
    };
  }
}
