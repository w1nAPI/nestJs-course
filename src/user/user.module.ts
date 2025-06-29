// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { MinioModule } from 'src/minio/minio.module';
import { JwtStrategy } from './authorization/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.USER_JWT_SECRET,
      signOptions: { expiresIn: process.env.USER_JWT_EXPIRES_IN },
    }),
    MinioModule,
  ],
  controllers: [UserController],
  providers: [UserService, PrismaService, JwtStrategy],
  exports: [JwtModule],
})
export class UserModule {}
