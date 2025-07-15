import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfigService {
  constructor(private readonly configService: ConfigService) {}

  private getOrThrow(key: string): string {
    const value = this.configService.get<string>(key);
    if (!value) {
      throw new Error(` Отсутствует требуемое значение конфигурации: ${key}`);
    }
    return value;
  }

  get adminSecret(): string {
    return this.getOrThrow('jwt.admin.secret');
  }

  get adminExpiresIn(): string {
    return this.getOrThrow('jwt.admin.expiresIn');
  }

  get adminHashSecret(): string {
    return this.getOrThrow('jwt.admin.hashSecret');
  }

  get userSecret(): string {
    return this.getOrThrow('jwt.user.secret');
  }

  get userExpiresIn(): string {
    return this.getOrThrow('jwt.user.expiresIn');
  }

  get userHashSecret(): string {
    return this.getOrThrow('jwt.user.hashSecret');
  }
}
