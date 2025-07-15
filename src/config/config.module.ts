import { Module } from '@nestjs/common';
import { JwtConfigService } from './jwt.config.service';
import { MinioConfigService } from './minio.config.service';

@Module({
  providers: [JwtConfigService, MinioConfigService],
  exports: [JwtConfigService, MinioConfigService],
})
export class ConfigModule {}
