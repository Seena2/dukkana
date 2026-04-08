import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  //Implement authentication logic here (e.g., register, login, token generation)
  private readonly SALT_ROUNDS = 12;
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Register a new user
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, firstName, lastName } = registerDto;
    // check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    try {
      // Hash the password before saving (use bcrypt or similar)
      const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);
      // Save the user to the database
      const user = await this.prisma.user.create({
        data: { email, password: hashedPassword, firstName, lastName },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          password: false,
        }, // Adjust fields as needed
      });
      // generate JWT token: both access and refresh tokens, the generateToken method is custom method
      const token = await this.generateTokens(user.id, user.email);
      // update the refresh token in the database for the user, the updateRefreshToken method is a custom method to update the refresh token in the database for the user
      await this.updateRefreshToken(user.id, token.refreshToken);
      // Return AuthResponseDto (adapt as needed)
      return {
        ...token,
        user,
      };
    } catch (error) {
      console.error('Error occurred while registering user:', error);
      throw new InternalServerErrorException(
        'Error occurred while registering user',
      ); // Rethrow the error to be handled by the caller
    }
  }

  //Generate access and refresh tokens
  private async generateTokens(
    userId: string,
    email: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Implement JWT token generation logic here (e.g., using jsonwebtoken library)
    const payload = { sub: userId, email };
    const refreshId = randomBytes(16).toString('hex'); // Generate a random refresh token ID
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '15m' }), // Access token expires in 15 minutes
      this.jwtService.signAsync({ ...payload, refreshId }, { expiresIn: '7d' }), // Refresh token expires in 7 days
    ]);
    // Store the refresh token in the database with an association to the user (optional but recommended)
    // await this.prisma.refreshToken.create({ data: { userId, refreshId } });
    return { accessToken, refreshToken };
  }

  // Update the refresh token in the database
  private async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    // Implement logic to update the refresh token in the database for the user
    const updatedRefreshToken = await bcrypt.hash(
      refreshToken,
      this.SALT_ROUNDS,
    );
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: updatedRefreshToken },
    });
  }

  // Refresh access tokens and generate new access token
  async refreshTokens(userId: string): Promise<AuthResponseDto> {
    // Implement logic to validate the refresh token and generate new access and refresh tokens
    // get the user from the database using the userId and check if the refresh token is valid
    // this.prisma.user.findUnique({ where: { refreshToken: ... } })
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        password: false,
        refreshToken: true,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
    // generate new access and refresh token
    const tokens = await this.generateTokens(user.id, user.email);
    // update the refresh token in the database for the user
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    // Return AuthResponseDto
    return {
      ...tokens,
      user,
    };
  }
  // Logout user by invalidating the refresh token
  async logout(userId: string): Promise<void> {
    // Implement logic to invalidate the refresh token for the user (e.g., remove it from the database)
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null }, // Clear the refresh token in the database
    });
  }
  // Login user and generate tokens
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;
    // Implement login logic here, e.g., validate user credentials and generate tokens
    // Find the user by email
    const user = await this.prisma.user.findUnique({ where: { email } });
    const passwordMatches = await bcrypt.compare(
      password,
      user?.password || '',
    );
    if (!user || !passwordMatches) {
      throw new Error('Invalid email or password');
    }
    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }
    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email);
    // Update the refresh token in the database for the user
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    // Return AuthResponseDto
    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }
}
