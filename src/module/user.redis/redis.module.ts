import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    RedisModule.forRoot({
      type: 'single',
      options: {
        host: 'localhost',
        port: 6379,
        // password: 'yourpassword', // Nếu có
        // db: 0,                  // Chọn database
      },
    }),
  ],
  exports: [RedisModule], // Quan trọng: export module
})
export class RedisConfigModule {}