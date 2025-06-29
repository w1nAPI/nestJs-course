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
import { JwtAuthGuard } from './authorization/jwt-auth.guard';
import { CurrentUser } from './authorization/current-user.decorator';
import { JwtPayload } from './authorization/jwt-payload.interface';

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

  @UseGuards(JwtAuthGuard)
  @Post('/image')
  @UseInterceptors(FileInterceptor('file'))
  updateImage(
    @CurrentUser() user: JwtPayload,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.updateUserImage(user.sub, file);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getFullInfo(@CurrentUser() user: JwtPayload) {
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

  @UseGuards(JwtAuthGuard)
  @Patch('/info')
  updateUserInfo(@CurrentUser() user: JwtPayload, @Body() dto: UpdateUserDto) {
    return this.userService.updateUserInfo(user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/password')
  changePassword(
    @CurrentUser() user: JwtPayload,
    @Body() dto: ChangePasswordUserDto,
  ) {
    return this.userService.changePassword(user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteUser(@CurrentUser() user: JwtPayload) {
    return this.userService.deleteUser(user.sub);
  }
}
