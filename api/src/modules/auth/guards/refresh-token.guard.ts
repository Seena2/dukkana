// Guard for protecting refresh token route/endpoints

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {}
