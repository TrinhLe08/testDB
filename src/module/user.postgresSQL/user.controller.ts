import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UserMySQLModule } from '../user.mySQL/user.module';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<UserMySQLModule[]> {
    return this.userService.findAll();
  }

  @Post()
  async create(@Body() user: UserMySQLModule): Promise<UserMySQLModule> {
    return this.userService.create(user);
  }
}