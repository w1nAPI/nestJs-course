import { Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [MinioService],
  exports: [MinioService],
})
export class MinioModule {}
