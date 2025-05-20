import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entities/user.schema.mongodb';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post()
  async create(@Body() user: User): Promise<User> {
    return this.userService.create(user);
  }


}