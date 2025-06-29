import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MinioModule } from 'src/minio/minio.module';

@Module({
  imports: [PrismaModule, MinioModule],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
