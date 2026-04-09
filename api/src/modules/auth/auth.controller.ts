import { Controller } from '@nestjs/common';
import { Body, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Register api endpoint for user registration
  @Post('register')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Register new user',
    description: 'Creates a new user account',
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request, Validation failed or user already exists',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many requests. Rate limit exceeded',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return await this.authService.register(registerDto);
  }
  // Refresh access token
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard) // Add appropriate guard for refresh token validation route
  @ApiBearerAuth('JWT-refresh')
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Generates new access token using a valid refresh token',
  })
  @ApiResponse({
    status: 201,
    description: 'New access token generated successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: ' Unauthorized, Invalid or expired refresh token',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many requests. Rate limit exceeded',
  })
  async refresh(@GetUser('id') userId: string): Promise<AuthResponseDto> {
    return await this.authService.refreshTokens(userId);
  }
  // Logout endpoint to invalidate the refresh token (optional, depending on your implementation)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard) // Add appropriate guard for refresh token validation
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Logout user',
    description: 'Logs out the user and invalidates the refresh token',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged out',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: ' Unauthorized, Invalid or expired refresh token',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many requests. Rate limit exceeded',
  })
  async logout(@GetUser('id') userId: string): Promise<{ message: string }> {
    // Implement logic to invalidate the refresh token for the user (e.g., remove it from the database)
    await this.authService.logout(userId); // Clear the refresh token in the database
    return { message: 'Logged out successfully' };
  }

  // login endpoint for user authentication and token generation
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticates user and returns access and refresh tokens',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged In',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: ' Unauthorized, Invalid credentials',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many requests. Rate limit exceeded',
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    // Implement your login logic here, e.g., validate user credentials and generate tokens
    return await this.authService.login(loginDto);
  }
}
