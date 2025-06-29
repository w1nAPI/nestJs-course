import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from '@prisma/client';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() dto: CreateReviewDto): Promise<Review> {
    return this.reviewService.createReview(dto);
  }

  @Get('user/:userId')
  async getByUserId(@Param('userId') userId: string): Promise<Review[]> {
    return this.reviewService.getReviewsByUserId(userId);
  }

  @Get('course/:courseId')
  async getByCourseId(@Param('courseId') courseId: string): Promise<Review[]> {
    return this.reviewService.getReviewsByCourseId(Number(+courseId));
  }

  @Put(':courseId/user/:userId')
  @UsePipes(new ValidationPipe())
  async updateReview(
    @Param('courseId') courseId: string,
    @Param('userId') userId: string,
    @Body() dto: UpdateReviewDto,
  ): Promise<Review> {
    return this.reviewService.updateReview(+courseId, userId, dto);
  }
}
