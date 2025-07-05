import { Controller, Delete, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthAdminGuard } from './authorization/jwt-auth.guard';
import { UserService } from 'src/user/user.service';
import { ReviewService } from 'src/review/review.service';

@Controller('admin/user')
export class AdminUserController {
  constructor(
    private readonly userService: UserService,
    private readonly reviewService: ReviewService,
  ) {}

  @UseGuards(JwtAuthAdminGuard)
  @Patch(':userId/ban')
  updateBanStatus(@Param('userId') id: string) {
    return this.userService.updateBanStatus(id);
  }

  @UseGuards(JwtAuthAdminGuard)
  @Delete(':userId/delete')
  deleteUser(@Param('userId') id: string) {
    return this.userService.deleteUser(id);
  }

  @UseGuards(JwtAuthAdminGuard)
  @Delete('/review/:courseId/:userId')
  deleteReview(
    @Param('courseId') courseId: number,
    @Param('userId') userId: string,
  ) {
    return this.reviewService.deleteReview(+courseId, userId);
  }
}
