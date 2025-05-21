import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEnity } from 'src/entities/user.entity.mysql';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEnity])], // Đăng ký repository
  providers: [UserService],
  controllers: [UserController],
})
export class UserMySQLModule {}