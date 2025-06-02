import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserPostgreSQLEntity } from './../../entities/user.entity.postgresql';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtService } from 'src/global/gobalJwt';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([UserPostgreSQLEntity])],
  providers: [UserService, JwtService],
  controllers: [UserController],
})
export class UserPostgresQLModule {}