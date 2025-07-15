import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'minio';
import { MinioConfigService } from 'src/config/minio.config.service';

@Injectable()
export class MinioService {
  private client: Client;
  private readonly logger = new Logger(MinioService.name);

  constructor(private readonly config: MinioConfigService) {
    this.client = new Client({
      endPoint: config.endpoint,
      port: config.port,
      accessKey: config.accessKey,
      secretKey: config.secretKey,
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
