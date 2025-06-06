import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserPostgreSQLEntity } from './../../entities/user.entity.postgresql';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtService } from 'src/global/gobalJwt';
import { RabbitMQService } from '../rabbitMQ/rabbitmq.service';
import { RabbitMQModule } from '../rabbitMQ/rabbitmq.module';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([UserPostgreSQLEntity]), RabbitMQModule],
  providers: [UserService, JwtService, RabbitMQService],
  controllers: [UserController],
})
export class UserPostgresQLModule {}