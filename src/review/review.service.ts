import { Injectable, BadRequestException } from '@nestjs/common';
import { Review } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(private readonly prismaService: PrismaService) {}

  async getReviewsByUserId(userId: string): Promise<Review[]> {
    const review = await this.prismaService.review.findMany({
      where: { userId },
    });
    if (!review) throw new BadRequestException('Отзыв не найден');
    return review;
  }

  async getReviewsByCourseId(courseId: number): Promise<Review[]> {
    return this.prismaService.review.findMany({
      where: { courseId },
    });
  }

  async getReview(courseId: number, userId: string): Promise<Review | null> {
    const existing = await this.prismaService.review.findUnique({
      where: {
        courseId_userId: {
          courseId,
          userId,
        },
      },
    });
    if (existing) {
      throw new BadRequestException('Отзыв уже существует');
    }
    return;
  }

  async createReview(userId: string, dto: CreateReviewDto): Promise<Review> {
    if (dto.userId !== userId)
      throw new BadRequestException(
        'Вы не можете оставить отзыв за другого пользователя',
      );

    await this.getReview(dto.courseId, dto.userId);

    return this.prismaService.review.create({
      data: {
        courseId: dto.courseId,
        userId: dto.userId,
        rating: dto.rating,
        title: dto.title,
        text: dto.text,
      },
    });
  }

  async updateReview(
    courseId: number,
    userId: string,
    dto: UpdateReviewDto,
  ): Promise<Review> {
    const existing = await this.getReview(courseId, userId);

    if (!existing) {
      throw new BadRequestException('Отзыв не найден');
    }

    return this.prismaService.review.update({
      where: {
        courseId_userId: {
          courseId,
          userId,
        },
      },
      data: {
        rating: dto.rating,
        title: dto.title,
        text: dto.text,
      },
    });
  }

  async deleteReview(courseId: number, userId: string): Promise<Review> {
    await this.getReview(courseId, userId);
    return this.prismaService.review.delete({
      where: {
        courseId_userId: {
          courseId,
          userId,
        },
      },
    });
  }
}
