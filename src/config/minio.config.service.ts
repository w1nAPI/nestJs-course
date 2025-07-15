import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MinioConfigService {
  constructor(private readonly configService: ConfigService) {}

  private getOrThrow(key: string): string {
    const value = this.configService.get<string>(key);
    if (!value) {
      throw new Error(`Отсутствует значение конфигурации: ${key}`);
    }
    return value;
  }

  get endpoint(): string {
    return this.getOrThrow('minio.endpoint');
  }

  get port(): number {
    const value = this.getOrThrow('minio.port');
    return Number(value);
  }

  get useSSL(): boolean {
    return this.configService.get<string>('minio.useSSL') === 'true';
  }

  get accessKey(): string {
    return this.getOrThrow('minio.accessKey');
  }

  get secretKey(): string {
    return this.getOrThrow('minio.secretKey');
  }

  get publicUrl(): string {
    return this.getOrThrow('minio.publicUrl');
  }
}
