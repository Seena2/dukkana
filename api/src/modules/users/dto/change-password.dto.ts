// DTO- data transfer object that defines validation rules for changing password
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Existing user password',
    example: 'oldPassword',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password must not be empty' })
  currentPassword!: string;

  @ApiProperty({
    description: 'New user password',
    example: 'newPassword',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty({ message: 'New Password must not be empty' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'The new password must contain at least one uppercase letter, one lowercase leter, One number, one special character',
    },
  )
  newPassword!: string;
}
