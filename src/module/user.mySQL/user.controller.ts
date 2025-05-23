import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UserMySQLEnity } from 'src/entities/user.entity.mysql';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<UserMySQLEnity[]> {
    return this.userService.findAll();
  }

  @Post()
  async create(@Body() user: UserMySQLEnity): Promise<UserMySQLEnity> {
    return this.userService.create(user);
  }
}