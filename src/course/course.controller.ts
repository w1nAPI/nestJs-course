import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CourseService } from './course.service';
import { MinioService } from 'src/minio/minio.service';
import { CreateCourseDto } from './dto/create-course.dto';

@Controller('course')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly minioService: MinioService,
  ) {}

  @Get('/all')
  async findAll() {
    return this.courseService.findAll();
  }

  @Post('/create')
  create(@Body() dto: CreateCourseDto) {
    return this.courseService.create(dto);
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('image'))
  async createWithImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateCourseDto,
  ) {
    if (!file) throw new BadRequestException('Файл обязателен');
    const objectName = await this.minioService.uploadFile('courses', file);
    return this.courseService.create({ ...dto, image: objectName });
  }

  @Get('/by-id/:id')
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(+id);
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() dto: CreateCourseDto) {
    return this.courseService.update(+id, dto);
  }

  @Put('/:id/upload')
  @UseInterceptors(FileInterceptor('image'))
  async updateWithImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateCourseDto,
  ) {
    const numericId = parseInt(id, 10);
    const course = await this.courseService.findOne(numericId);

    if (file) {
      if (course.image) {
        await this.minioService.deleteFile('courses', course.image);
      }
      dto.image = await this.minioService.uploadFile('courses', file);
    }

    return this.courseService.update(numericId, dto);
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.courseService.delete(+id);
  }
}
