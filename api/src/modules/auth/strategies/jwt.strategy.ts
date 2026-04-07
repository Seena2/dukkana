// JWT strategy for auth requests
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor( private prisma: PrismaService, private configService: ConfigService ){
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') ?? 'defaultSecretKey2026',
    });
  }
  // Validate JWT payload
  // payload contains the user ID (sub/subject) and email
  async validate(payload: { sub: string; email: string }) {
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true,updatedAt: true,
        password: false, // Exclude password from the returned user object
      },
    });
    // if user is not found, throw an unauthorized exception
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
