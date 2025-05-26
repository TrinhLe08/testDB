import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
   constructor(
    @InjectRedis() private readonly redis: Redis 
  ) {}

  getHello(): string {
    return 'Welcomme the King is back ';
  }

    async setData(key: string, value: string) {
    await this.redis.set(key, value);
  }

  async getData(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }
}