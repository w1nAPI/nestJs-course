import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtAdminStrategy } from './authorization/jwt-strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.ADMIN_JWT_SECRET,
      signOptions: { expiresIn: process.env.ADMIN_JWT_EXPIRES_IN },
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, JwtAdminStrategy],
})
export class AdminModule {}
