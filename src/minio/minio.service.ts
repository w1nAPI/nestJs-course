import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';

@Injectable()
export class MinioService {
  private client: Client;
  private readonly logger = new Logger(MinioService.name);

  constructor(private readonly configService: ConfigService) {
    this.client = new Client({
      endPoint: configService.get<string>('MINIO_ENDPOINT'),
      port: parseInt(configService.get<string>('MINIO_PORT'), 10),
      useSSL: configService.get<string>('MINIO_USE_SSL') === 'true',
      accessKey: configService.get<string>('MINIO_ACCESS_KEY'),
      secretKey: configService.get<string>('MINIO_SECRET_KEY'),
    });
  }

  async ensureBucket(bucket: string) {
    const exists = await this.client.bucketExists(bucket);
    if (!exists) {
      await this.client.makeBucket(bucket);
    }
  }

  async uploadFile(bucket: string, file: Express.Multer.File): Promise<string> {
    await this.ensureBucket(bucket);
    const objectName = `${Date.now()}-${file.originalname}`;
    await this.client.putObject(bucket, objectName, file.buffer, file.size, {
      'Content-Type': file.mimetype,
    });
    return objectName;
  }

  async deleteFile(bucket: string, objectName: string) {
    await this.client.removeObject(bucket, objectName);
  }
}
