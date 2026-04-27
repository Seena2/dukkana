import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PaymentsService } from './payments.service';
import {
  CreatePaymentIntentApiResponseDto,
  PaymentApiResponseDto,
} from './dto/payment_response.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { ConfirmPaymentDto } from './dto/confirm_payment.dto';

@Controller('payments')
@ApiTags('payments')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  //payment Intent for order
  @Post('create-intent')
  @ApiOperation({
    summary: 'create payment intent',
    description: 'Creates a payment intent for an order',
  })
  @ApiCreatedResponse({
    description: 'Payment intent created successfully',
    type: CreatePaymentIntentApiResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid data or order not found' })
  async createPaymentIntent(
    @GetUser('id') userId: string,
    @Body() createPaymentIntentDto: CreatePaymentIntentDto,
  ) {
    return await this.paymentsService.createPaymentIntent(
      userId,
      createPaymentIntentDto,
    );
  }

  // Confirm payment intent
  @Post('confirm')
  @ApiOperation({
    summary: 'Confirm payment for a given order',
    description: 'Confirm payment intent for an order',
  })
  @ApiResponse({
    description: 'Payment confirmed successfully',
    status: 200,
    type: PaymentApiResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Payment not found or already completed',
  })
  async confirmPayment(
    @GetUser('id') userId: string,
    @Body() confirmPaymentDto: ConfirmPaymentDto,
  ) {
    return await this.paymentsService.confirmPayment(userId, confirmPaymentDto);
  }

  // Get all payment for specific user
  @Get()
  @ApiOperation({ summary: 'Get all payments for current user' })
  @ApiOkResponse({
    description: 'Payment recieved successfully',
    type: PaymentApiResponseDto,
  })
  async getAllPayments(@GetUser('id') userId: string) {
    return await this.paymentsService.fetchAllPayments(userId);
  }

  // Get single payment by id
  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'Payment Id',
    example: '154sd4848ds5d-4654-4sdd8s7d-sd4656',
  })
  @ApiOperation({
    summary: 'Get  payments by id',
    description: 'Get specific payment details by its id',
  })
  @ApiOkResponse({
    description: 'Payment retreived successfully',
    type: PaymentApiResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Payment not found' })
  async getPaymentById(
    @Param('id') paymentId: string,
    @GetUser('id') userId: string,
  ) {
    return await this.paymentsService.fetchPaymentById(paymentId, userId);
  }

  // Get payment by Order id
  @Get('order/:orderId')
  @ApiParam({ name: 'orderId', description: 'order Id', example: 'order-123' })
  @ApiOperation({
    summary: 'Get  payments by order id',
    description: 'Get  payment  detail for specific order',
  })
  @ApiOkResponse({
    description: 'Payment retreived successfully',
    type: PaymentApiResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Payment not found' })
  async getPaymentByOrderId(
    @Param('orderId') orderId: string,
    @GetUser('id') userId: string,
  ) {
    return await this.paymentsService.fetchPaymentByOrderId(orderId, userId);
  }
}
