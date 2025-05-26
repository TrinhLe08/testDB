import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  
  @Get('set')
  async setValue(
    @Query('key') key: string,
    @Query('value') value: string
  ) {
    await this.appService.setData(key, value);
    return `Set ${key}=${value} successfully`;
  }

  @Get('get')
  async getValue(@Query('key') key: string) {
    const value = await this.appService.getData(key);
    return { key, value };
  }

}
