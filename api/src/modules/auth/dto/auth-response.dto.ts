// Data Transfer Object (DTO) for auth response
import { Role } from '@prisma/client';

export class AuthResponseDto {
  accessToken!: string;
  refreshToken!: string;
  expiresIn?: number; // Token expiration time in seconds
  user!: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: Role;
  };
}
