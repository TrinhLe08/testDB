declare const module: any;

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ThrottlerExceptionFilter } from './global/globalErrorRateLimit';
import { AppModule } from './app.module';

async function bootstrap() {
    console.log(ThrottlerGuard);
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true })); 
  const throttlerGuard = app.get(ThrottlerGuard);
  app.useGlobalGuards(throttlerGuard);
  app.useGlobalFilters(new ThrottlerExceptionFilter());
  app.use(express.json());



  const config = new DocumentBuilder()
    .setTitle('Test DB API')
    .setDescription('API for testing database operations')
    .setVersion('1.0')
    .addBearerAuth() // JWT support
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 10000);
      console.log(`Server is running on http://localhost:${process.env.PORT}`);
      console.log(`Swagger UI: http://localhost:${process.env.PORT}/api-docs`);
  
    if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());  
  }
}
bootstrap();
