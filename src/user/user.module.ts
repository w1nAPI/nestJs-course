import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { MinioModule } from 'src/minio/minio.module';
import { JwtUserStrategy } from './authorization/jwt.strategy';
import { ReviewModule } from 'src/review/review.module';
import { ConfigModule } from 'src/config/config.module';
import { JwtConfigService } from 'src/config/jwt.config.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [JwtConfigService],
      useFactory: (jwtConfigService: JwtConfigService) => ({
        secret: jwtConfigService.userSecret,
        signOptions: {
          expiresIn: jwtConfigService.userExpiresIn,
        },
      }),
    }),
    MinioModule,
    ReviewModule,
  ],
  controllers: [UserController],
  providers: [UserService, JwtUserStrategy],
  exports: [JwtModule, UserService],
})
export class UserModule {}
