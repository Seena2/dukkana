import { Controller, Get, UseGuards, Req, Param, Patch, Body, HttpCode, HttpStatus, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';
import type { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersServervice: UsersService) {}
  //REGULAR USER ROUTES
  // Get current user profile
  @Get('me') //root route "/"
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'successfully got the current user profile ',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserProfile(@Req() req: RequestWithUser): Promise<UserResponseDto> {
    return await this.usersServervice.getOneUser(req.user.id);
  }

  // Update current user profile route
  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile data' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'successfully updated user profile',
    type: UserResponseDto,  })
  @ApiResponse({ status: 401, description: 'Unauthorize' })
  @ApiResponse({ status: 409, description: ' The email is already in use' })
  async updateUserProfile( @GetUser('id') userId:string, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto>{
    return await this.usersServervice.upateUserProfile(userId, updateUserDto);
  }

  // change current user password route
  @Patch('me/password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change current user password' })
  @ApiResponse({ status: 200, description: ' Password changed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorize' })
  async changeUserPassword(@GetUser('id') userId:string, @Body() changePasswordDto: ChangePasswordDto): Promise<{message:string}>{
    return await this.usersServervice.changeUserPassword(userId, changePasswordDto);
  }

  // Delete current user account route
  @Delete('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete current user account' })
  @ApiResponse({ status: 200, description: ' User account deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorize' })
  async deleteUserAccount( @GetUser('id') userId: string ): Promise<{ message: string }> {
    return await this.usersServervice.removeUserAccount(userId);
  }

  //ADMIN ROUTES
  // Get all users(for admin purposes)
  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'list of ll users',
    type: [UserResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorize' })
  async getAllUsers(): Promise<UserResponseDto[]> {
    return await this.usersServervice.getAllUsers();
  }

  // Get user by Id route (for admin purposes)
  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get users by id' })
  @ApiResponse({
    status: 200,
    description: 'Get user with the specified id',
    type: [UserResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorize' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    return await this.usersServervice.getOneUser(id);
  }

  // Delete user account( for admin purpose)
  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiResponse({ status: 200, description: 'User with specified ID deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorize' })
  async deleteUserById(@Param('id') id: string): Promise<{ message: string }> {
    return await this.usersServervice.removeUserAccount(id);
  }
}
