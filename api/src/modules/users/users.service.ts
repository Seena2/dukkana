import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly SALT_ROUNDS = 12;
  constructor(private prisma: PrismaService) {}
  // REGULAR USER ROUTE METHODS
  // Get one user from the DB using prisma
  async getOneUser(userId: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Update user profile
  async upateUserProfile(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existingUser) {
      throw new NotFoundException('User not found!');
    }
    // check if the new email that comes with request object, doesn't match old email and already not taken by another user
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const isEmailTaken = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });
      if (isEmailTaken) {
        throw new NotFoundException('Email is already taken');
      }
    }
    // else Update the user profile with new data
    const updatedUserData = await this.prisma.user.update({
      where: { id: userId },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    });
    return updatedUserData;
  }

  // Change  user password
  async changeUserPassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const { currentPassword, newPassword } = changePasswordDto;
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    // check if the old PW user provided is the correct by comparing to pw stored in DB
    const isOldPasswordvalid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isOldPasswordvalid) {
      throw new NotFoundException(' The old password is incorrect');
    }
    // check if the new PW  user provided is NOT the same as to existing pw
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new NotFoundException(
        ' The New password  must be different from the old password',
      );
    }
    //else hash the new pw and update the old PW with new pw in the DB
    const hashedNewPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });
    return { message: 'Password changed successfully' };
  }

  // Delete user account
  async removeUserAccount(userId: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    await this.prisma.user.delete({ where: { id: userId } });
    return { message: 'User account deleted successfuly' };
  }

  // ADMIN ROUTE METHODS
  // Get all users from DB using the prisma, leaves out the user password
  async getAllUsers(): Promise<UserResponseDto[]> {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
