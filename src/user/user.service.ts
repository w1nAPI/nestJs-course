import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { MinioService } from 'src/minio/minio.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordUserDto } from './dto/change-password-user.dto';
import { ResponseUserDto } from './dto/response-user-dto';
import { JwtConfigService } from 'src/config/jwt.config.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly minioService: MinioService,
    private readonly jwtConfig: JwtConfigService,
  ) {}

  async findByEmail(email: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!user) throw new BadRequestException('Пользователь не найден');
    return user;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return !!user;
  }
  async generateToken(userId: string): Promise<string> {
    return this.jwtService.sign({ sub: userId });
  }

  async register(dto: CreateUserDto): Promise<ResponseUserDto> {
    const userExists = await this.existsByEmail(dto.email);
    if (userExists) {
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    }

    const hashedPassword = await bcrypt.hash(
      dto.password + this.jwtConfig.userHashSecret,
      10,
    );

    const user = await this.prismaService.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
        image: 'yoshi.jpg',
        ban: false,
      },
    });

    const token = await this.generateToken(user.id);

    return {
      id: user.id,
      name: user.name,
      accessToken: token,
    };
  }

  async login(dto: LoginUserDto): Promise<ResponseUserDto> {
    const user = await this.findByEmail(dto.email);
    if (!user) throw new BadRequestException('Пользователь не найден');

    if (user.ban) {
      throw new BadRequestException('Пользователь заблокирован');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password + this.jwtConfig.userHashSecret,
      user.password,
    );

    if (!isPasswordValid) throw new BadRequestException('Неверный пароль');

    const token = await this.generateToken(user.id);

    return {
      id: user.id,
      name: user.name,
      accessToken: token,
    };
  }

  async updateUserImage(userId: string, file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Файл не предоставлен');

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { image: true },
    });

    if (user?.image && user.image !== 'yoshi.jpg') {
      try {
        await this.minioService.deleteFile('users-bucket', user.image);
      } catch (err) {
        console.error('Ошибка при удалении старого изображения:', err);
      }
    }

    const objectName = await this.minioService.uploadFile('users-bucket', file);

    await this.prismaService.user.update({
      where: { id: userId },
      data: { image: objectName },
    });

    return { message: 'Изображение успешно обновлено' };
  }

  async getFullInfo(userId: string): Promise<Omit<User, 'password'>> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        ban: true,
      },
    });

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    return user;
  }

  async updateBanStatus(userId: string): Promise<boolean> {
    const user = await this.getFullInfo(userId);
    const newBanStatus = !user.ban;

    await this.prismaService.user.update({
      where: { id: userId },
      data: { ban: newBanStatus },
    });

    return newBanStatus;
  }

  async isBanned(userId: string): Promise<boolean> {
    const user = await this.getFullInfo(userId);
    return user.ban;
  }

  async updateUserInfo(
    userId: string,
    dto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    if (dto.email) {
      const existingUser = await this.prismaService.user.findUnique({
        where: { email: dto.email },
        select: { id: true },
      });

      if (existingUser && existingUser.id !== userId) {
        throw new BadRequestException(
          'Пользователь с таким email уже существует',
        );
      }
    }
    const user = await this.prismaService.user.update({
      where: { id: userId },
      data: {
        name: dto.name,
        email: dto.email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        ban: true,
        image: true,
      },
    });
    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }
    return user;
  }

  async changePassword(
    userId: string,
    newPassword: ChangePasswordUserDto,
  ): Promise<string> {
    const hashedPassword = await bcrypt.hash(
      newPassword + process.env.USER_HASH_SECRET,
      10,
    );

    await this.prismaService.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return 'Пароль успешно изменен';
  }

  async deleteUser(userId: string): Promise<string> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { image: true },
    });

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    if (user.image && user.image !== 'yoshi.jpg') {
      try {
        await this.minioService.deleteFile('users-bucket', user.image);
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new BadRequestException(
            `Ошибка при удалении изображения: ${err.message}`,
          );
        }
        throw new BadRequestException('Ошибка при удалении изображения');
      }
    }

    await this.prismaService.user.delete({
      where: { id: userId },
    });

    return 'Пользователь успешно удалён';
  }
}
