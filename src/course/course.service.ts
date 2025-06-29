import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { Course } from '@prisma/client';
import { MinioService } from 'src/minio/minio.service';

@Injectable()
export class CourseService {
  private readonly logger = new Logger(CourseService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly minioService: MinioService,
  ) {}

  async create(dto: CreateCourseDto): Promise<Course> {
    return this.prismaService.course.create({ data: dto });
  }

  async createWithImage(
    dto: CreateCourseDto,
    file: Express.Multer.File,
  ): Promise<Course> {
    const objectName = await this.minioService.uploadFile('courses', file);
    dto.image = objectName;
    return this.create(dto);
  }

  async findAll(): Promise<Course[]> {
    return this.prismaService.course.findMany();
  }

  async findOne(id: number): Promise<Course> {
    const course = await this.prismaService.course.findUnique({
      where: { id },
    });
    if (!course) throw new NotFoundException('Курс не найден');
    return course;
  }

  async update(id: number, dto: CreateCourseDto): Promise<Course> {
    await this.findOne(id);

    return this.prismaService.course.update({
      where: { id },
      data: {
        title: dto.title,
        url: dto.url,
        image: dto.image,
      },
    });
  }

  async delete(id: number): Promise<boolean> {
    const course = await this.findOne(id);

    if (course.image) {
      try {
        await this.minioService.deleteFile('courses', course.image);
      } catch (error) {
        this.logger.warn(
          'Ошибка при удалении изображения из MinIO:' + error.message,
        );
      }
    }

    await this.prismaService.course.delete({ where: { id } });
    return true;
  }
}
