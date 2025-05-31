declare const module: any;

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
