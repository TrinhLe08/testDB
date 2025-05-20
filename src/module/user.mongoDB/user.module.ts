import { User ,UserSchema } from './../../entities/user.schema.mongodb';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Đăng ký Model
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserMongoDBModule {}