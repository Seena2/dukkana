import { Request } from 'express';

// Request with user Interfaces
export interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    role: string;
  };
}
