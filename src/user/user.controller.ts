import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordUserDto } from './dto/change-password-user.dto';
import { CurrentUser } from './authorization/current-user.decorator';
import { JwtAuthUserGuard } from './authorization/jwt-auth.guard';
import { JwtUserPayload } from './authorization/jwt-payload.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @Post('/login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @UseGuards(JwtAuthUserGuard)
  @Post('/image')
  @UseInterceptors(FileInterceptor('file'))
  updateImage(
    @CurrentUser() user: JwtUserPayload,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.updateUserImage(user.sub, file);
  }

  @UseGuards(JwtAuthUserGuard)
  @Get()
  getFullInfo(@CurrentUser() user: JwtUserPayload) {
    return this.userService.getFullInfo(user.sub);
  }

  @Patch(':id/ban')
  updateBanStatus(@Param('id') id: string) {
    return this.userService.updateBanStatus(id);
  }

  @Get(':id/ban')
  isBanned(@Param('id') id: string) {
    return this.userService.isBanned(id);
  }
  ß;

  @UseGuards(JwtAuthUserGuard)
  @Patch('/info')
  updateUserInfo(
    @CurrentUser() user: JwtUserPayload,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateUserInfo(user.sub, dto);
  }

  @UseGuards(JwtAuthUserGuard)
  @Patch('/password')
  changePassword(
    @CurrentUser() user: JwtUserPayload,
    @Body() dto: ChangePasswordUserDto,
  ) {
    return this.userService.changePassword(user.sub, dto);
  }

  @UseGuards(JwtAuthUserGuard)
  @Delete()
  deleteUser(@CurrentUser() user: JwtUserPayload) {
    return this.userService.deleteUser(user.sub);
  }
}
