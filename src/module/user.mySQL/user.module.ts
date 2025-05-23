import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMySQLEnity } from 'src/entities/user.entity.mysql';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserMySQLEnity])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserMySQLModule {}