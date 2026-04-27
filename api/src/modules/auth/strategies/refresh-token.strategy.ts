// Refresh token strategy for validating refresh tokens and issuing new access tokens
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_REFRESH_SECRET') ??
        'defaultSecretKey2026',
      passReqToCallback: true, // Pass the request to the validate method to access the refresh token from the request body or headers
    });
  }
  //Validate the refresh token and issue a new access token
  async validate(req: Request, payload: { sub: string; email: string }) {
    console.log('Validating refresh token for user:', payload);
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.error(
        'No authorization header provided for refresh token validation for user:',
        payload.sub,
      );
      throw new UnauthorizedException('Authorization header not provided');
    }
    const refreshToken = authHeader.replace('Bearer ', '').trim();
    if (!refreshToken) {
      console.error(
        'No refresh token found in authorization header for user:',
        payload.sub,
      );
      throw new UnauthorizedException('Refresh token not provided');
    }
    // fetch the user from the database and compare the provided refresh token with the stored hashed refresh token
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        password: false, // Exclude password from the returned user object
        refreshToken: true, // Include the hashed refresh token for validation
      },
    });
    if (!user || !user.refreshToken) {
      console.error(
        'User not found during refresh token validation for user:',
        payload.sub,
      );
      throw new UnauthorizedException('User not found');
    }
    // Implement logic to validate the refresh token (e.g., compare with stored hashed token in the database)
    const isValidRefreshToken = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!isValidRefreshToken) {
      console.error('Invalid refresh token provided for user:', payload.sub);
      throw new UnauthorizedException('Invalid refresh token');
    }
    // If valid, return the user information to be used in the request context for issuing a new access token
    return { id: user.id, email: user.email, role: user.role };
  }
}
