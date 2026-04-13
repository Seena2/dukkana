// Role Guard
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requireRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // if No role is required proceed
    if (!requireRoles) {
      return true;
    }
    // else, if role is required extract the authenticated user from the request
    const { user } = context.switchToHttp().getRequest();
    return requireRoles.some((role) => user.role === role);
  }
}
