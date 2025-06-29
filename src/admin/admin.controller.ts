import { Controller, Post, Body, Param, Put } from '@nestjs/common';
import { AdminService } from './admin.service';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { LoginAdminDto } from './dto/login-admin-dto';

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

  @Put('update/:id')
  update(@Param('id') id: string, @Body() updateAdminDto: RegisterAdminDto) {
    return this.adminService.update(id, updateAdminDto);
  }
}
