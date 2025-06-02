import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPostgreSQLEntity } from './../../entities/user.entity.postgresql';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserPostgreSQLEntity])], // Đăng ký repository
  providers: [UserService],
  controllers: [UserController],
})
export class UserPostgresQLModule {}