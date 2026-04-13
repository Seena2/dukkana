// JWT auth guard to protect routes that require authentication
import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // reflector is used to access the metadata of the route handler,
  constructor(private reflector: Reflector) {
    super();
  }
  // canActivate method is called by NestJS to determine if the current request should be allowed to proceed or not.
  // It checks for the presence of a valid JWT token in the request headers and validates it.
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
