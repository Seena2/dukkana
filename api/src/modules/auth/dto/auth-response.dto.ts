// Data Transfer Object (DTO) for auth response
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class AuthResponseDto {
  @ApiProperty({
    description: 'Access token for authorization',
    example:
      'a0e6c1ebd59494712f3873d6137f2ec84977aea7c8acdaeda327bd30e0900cb3c321a76b690bfd8ba640e1a9d45d37d3be09b8467e3872abfa9149df0816e6aa',
  })
  accessToken!: string;

  @ApiProperty({
    description: 'Refresh token for optaing new access token',
    example:
      'a0e6c1ebd59494712f3873d6137f2ec84977aea7c8acdaeda327bd30e0900cb3c321a76b690bfd8ba640e1a9d45d37d3be09b8467e3872abfa9149df0816e6aa',
  })
  refreshToken!: string;

  @ApiProperty({
    description: 'Token expiration time in seconds',
    example: 900,
  })
  expiresIn?: number; // Token expiration time in seconds

  @ApiProperty({
    description: 'Authenticated user info',
    example: {
      id: 'user-123',
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'USER',
    },
  })
  user!: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: Role;
  };
}
