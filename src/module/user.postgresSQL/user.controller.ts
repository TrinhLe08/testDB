import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UserPostgresQLEnity } from 'src/entities/user.entity.postgresql';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<UserPostgresQLEnity[]> {
    return this.userService.findAll();
  }

  @Post()
  async create(@Body() user: UserPostgresQLEnity): Promise<UserPostgresQLEnity> {
    return this.userService.create(user);
  }
}