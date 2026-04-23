// DTO for payment response
import { ApiProperty } from '@nestjs/swagger';

// Actual payment information(Detailed payment payload returned to the client)
export class PaymentResponseDto {
  @ApiProperty({ description: 'payment id', example: '1215645s454sdosd4s-454sd' })
  id!: string;
  @ApiProperty({ example: 'order-123' })
  orderId!: string;
  @ApiProperty({ example: 99.99 })
  amount!: number;
  @ApiProperty({ example: 'user-456' })
  userId!: string;
  @ApiProperty({ example: 'usd' })
  currency!: string;

  @ApiProperty({ description: 'payment status', example: 'COMPLETED',
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED']})
  status!: string;

  @ApiProperty({example: 'STRIPE', nullable: true })
  paymentMethod?: string | null;

  @ApiProperty({ example: 'pi_1213546846', nullable: true })
  transactionId?: string | null;

  @ApiProperty({})
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

// Payment response retunred from the endpoint
export class PaymentApiResponseDto {
  @ApiProperty({ description: 'is payment succeded', example: true })
  success!: boolean;

  @ApiProperty({ description: 'payment details', type: PaymentResponseDto })
  data!: PaymentResponseDto;

  @ApiProperty({ example: 'Payment retrieved successfully', required: false })
  message?: string;
}

// Payment intent for an order
export class CreatePaymentIntentResponse {
  @ApiProperty({ description: 'Stripe client secret for payment confirmation,',
    example: 'pi_165465465' })
  clientSecret!: string;

  @ApiProperty({ description: 'Payment ID in database',
    example: '2165465-454-sds4s854d65' })
  paymentId!: string;
}

export class CreatePaymentIntentApiResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ type: CreatePaymentIntentResponse })
  data!: CreatePaymentIntentResponse;

  @ApiProperty({ example: 'Payment intent created successfully', required: false })
  message?: string;
}
