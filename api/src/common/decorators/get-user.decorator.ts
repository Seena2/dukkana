// Custom decorator to extract the user information from the request object
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = Request.user; // Assuming the user information is attached to the request object by the authentication middleware
    return data ? user?.[data] : user; // Return specific property if data is provided, otherwise return the whole user object
  },
);
