import { IsString, MinLength } from 'class-validator';

export class ChangePasswordUserDto {
  @IsString()
  @MinLength(6)
  password: string;
}
