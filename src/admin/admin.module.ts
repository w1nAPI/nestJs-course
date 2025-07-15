import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtAdminStrategy } from './authorization/jwt-strategy';
import { UserModule } from 'src/user/user.module';
import { AdminUserController } from './admin-user.controller';
import { ReviewModule } from 'src/review/review.module';
import { JwtConfigService } from 'src/config/jwt.config.service';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [JwtConfigService],
      useFactory: (jwtConfigService: JwtConfigService) => ({
        secret: jwtConfigService.adminSecret,
        signOptions: {
          expiresIn: jwtConfigService.adminExpiresIn,
        },
      }),
    }),
    UserModule,
    ReviewModule,
  ],
  controllers: [AdminController, AdminUserController],
  providers: [AdminService, JwtAdminStrategy],
})
export class AdminModule {}
