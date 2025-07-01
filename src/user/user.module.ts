import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { MinioModule } from 'src/minio/minio.module';
import { JwtUserStrategy } from './authorization/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.USER_JWT_SECRET,
      signOptions: { expiresIn: process.env.USER_JWT_EXPIRES_IN },
    }),
    MinioModule,
  ],
  controllers: [UserController],
  providers: [UserService, JwtUserStrategy],
  exports: [JwtModule],
})
export class UserModule {}
