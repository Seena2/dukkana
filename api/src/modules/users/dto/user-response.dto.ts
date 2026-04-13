// users response DTO
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: 'f30eddc7-58d8-41ff-bf2b-cdee5806ea5b',
  })
  id!: string;

  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  email!: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    nullable: true,
  })
  firstName!: string | null;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    nullable: true,
  })
  lastName!: string | null;

  @ApiProperty({
    description: 'User role',
    enum: Role,
  })
  role!: Role; //USER | ADMIN

  @ApiProperty({
    description: 'Account creation date',
    example: '2026-04-09 03:27:04.832',
  })
  createdAt!: Date;

  @ApiProperty({
    description: ' Last account update date',
    example: '2026-04-09 03:27:04.832',
  })
  updatedAt!: Date;
}
