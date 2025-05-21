import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEnity } from 'src/entities/user.entity.mysql';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<UserEnity[]> {
    return this.userService.findAll();
  }

  @Post()
  async create(@Body() user: UserEnity): Promise<UserEnity> {
    return this.userService.create(user);
  }
}