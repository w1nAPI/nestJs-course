import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtAdminStrategy } from './authorization/jwt-strategy';
import { UserModule } from 'src/user/user.module';
import { AdminUserController } from './admin-user.controller';
import { ReviewModule } from 'src/review/review.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.ADMIN_JWT_SECRET,
      signOptions: { expiresIn: process.env.ADMIN_JWT_EXPIRES_IN },
    }),
    UserModule,
    ReviewModule,
  ],
  controllers: [AdminController, AdminUserController],
  providers: [AdminService, JwtAdminStrategy],
})
export class AdminModule {}
