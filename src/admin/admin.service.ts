import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { LoginAdminDto } from './dto/login-admin-dto';
import { AdminResponseDto } from './dto/admin-response-dto';
import { Admin } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async findById(id: string): Promise<Omit<Admin, 'password'>> {
    const admin = await this.prismaService.admin.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    if (!admin) {
      throw new UnauthorizedException('Администратор не найден');
    }

    return admin;
  }

  async findByEmail(email: string) {
    return this.prismaService.admin.findUnique({
      where: { email },
    });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const admin = await this.prismaService.admin.findUnique({
      where: { email },
      select: { id: true },
    });
    return !!admin;
  }

  async register(dto: RegisterAdminDto): Promise<AdminResponseDto> {
    const adminExists = await this.existsByEmail(dto.email);
    if (adminExists) {
      throw new Error('Администратор с таким email уже существует');
    }

    const hashedPassword = await bcrypt.hash(
      dto.password + process.env.ADMIN_HASH_SECRET,
      10,
    );

    const admin = await this.prismaService.admin.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
      },
    });

    const token = this.jwtService.sign({ sub: admin.id });

    return {
      id: admin.id,
      name: admin.name,
      accessToken: token,
    };
  }

  async login(dto: LoginAdminDto): Promise<AdminResponseDto> {
    const admin = await this.findByEmail(dto.email);
    if (!admin) {
      throw new Error('Администратор с таким email не найден');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password + process.env.ADMIN_HASH_SECRET,
      admin.password,
    );

    if (!isPasswordValid) {
      throw new Error('Неверный пароль');
    }

    const token = this.jwtService.sign({ sub: admin.id });

    return {
      id: admin.id,
      name: admin.name,
      accessToken: token,
    };
  }

  async update(id: string, dto: UpdateAdminDto): Promise<Admin> {
    return await this.prismaService.admin.update({
      where: { id },
      data: dto,
    });
  }
}
