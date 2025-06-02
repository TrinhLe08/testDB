import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
// import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
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

  // @Throttle({ default: { limit: 5, ttl: 30000 }})
  @Post('login')
  async loginUser(@Body() userInformation : {email : string, password : string}) :Promise<any> {
    try {
      if (userInformation.email && userInformation.password) {
          return this.userService.login(userInformation.email, userInformation.password)
      } else {
          return new ResponseData<string>(
                  'Wrong Information',
                  HttpStatus.ERROR,
                  HttpMessage.ERROR,
                );
      }
    } catch (err) {
        console.log(err);
          return new ResponseData<string>(
                  'Wrong Information',
                  HttpStatus.ERROR,
                  HttpMessage.ERROR,
                );
    }

  }
  
@Post('/register')
async create(@Body() user: { name: string; email: string; password: string }) {
  return this.userService.create(user);
}
}