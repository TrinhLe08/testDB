import { Controller, UseInterceptors , Get, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserPostgreSQLEntity } from './../../entities/user.entity.postgresql';
import { SwaggerGetAllUsers, SwaggerCreateUser } from './swagger.decorator';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @SwaggerGetAllUsers() 
  async findAll(): Promise<UserPostgreSQLEntity[]> {
    return this.userService.findAll();
  }

  @Post()
  @SwaggerCreateUser()
  async create(@Body() user: UserPostgreSQLEntity): Promise<any> {
    return this.userService.create(user);
  }
}