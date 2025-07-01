import { Controller, Post, Body, Put, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { LoginAdminDto } from './dto/login-admin-dto';
import { CurrentAdmin } from './authorization/current-admin.decorator';
import { JwtAuthAdminGuard } from './authorization/jwt-auth.guard';
import { JwtAdminPayload } from './authorization/jwt-payload.interface';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('register')
  register(@Body() registerAdminDto: RegisterAdminDto) {
    return this.adminService.register(registerAdminDto);
  }

  @Post('login')
  login(@Body() loginAdminDto: LoginAdminDto) {
    return this.adminService.login(loginAdminDto);
  }

  @UseGuards(JwtAuthAdminGuard)
  @Put('update/')
  update(
    @CurrentAdmin() admin: JwtAdminPayload,
    @Body() updateAdminDto: RegisterAdminDto,
  ) {
    return this.adminService.update(admin.sub, updateAdminDto);
  }
}
