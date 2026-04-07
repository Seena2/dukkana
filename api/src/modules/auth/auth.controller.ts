import { Body, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Register api endpoint for user registration
  @Post('register')
  @HttpCode(201)
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return await this.authService.register(registerDto);
  }
  // Refresh access token
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard) // Add appropriate guard for refresh token validation
  async refresh(@GetUser('id') userId: string): Promise<AuthResponseDto> {
    return await this.authService.refreshTokens(userId);
  }
  // Logout endpoint to invalidate the refresh token (optional, depending on your implementation)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard) // Add appropriate guard for refresh token validation
  async logout(@GetUser('id') userId: string): Promise<{ message: string }> {
    // Implement logic to invalidate the refresh token for the user (e.g., remove it from the database)
    await this.authService.logout(userId); // Clear the refresh token in the database
    return { message: 'Logged out successfully' };
  }

  // login endpoint for user authentication and token generation
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    // Implement your login logic here, e.g., validate user credentials and generate tokens
    return await this.authService.login(loginDto);
  }
}
