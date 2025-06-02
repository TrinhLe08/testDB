import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerGuard   } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtService } from './global/gobalJwt';
import { UserMongoDBModule } from './module/user.mongoDB/user.module';
import { UserMySQLEnity } from './entities/user.entity.mysql';
import { UserMySQLModule } from './module/user.mySQL/user.module';
import { UserPostgreSQLEntity } from './entities/user.entity.postgresql';
import { UserPostgresQLModule } from './module/user.postgresQL/user.module';
import { RedisConfigModule } from './module/user.redis/redis.module';
import { GraphqlModule } from './graphql.module';
import { BookModule } from './module/book.postgresQL/book.module';
import { BookGragQLPostgresQLEntity } from './entities/book.grapQL.postgresql/book.entity';
import { CheckTokenMiddleware } from './middlewares/user.checkToken';

dotenv.config();

//MongoDB

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//       envFilePath: '.env',
//     }),
//     MongooseModule.forRootAsync({
//       imports: [ConfigModule],
//       useFactory: async (configService: ConfigService) => ({
//         uri: configService.get<string>('MONGODB_URI'),
//       }),
//       inject: [ConfigService],
//     }),
//     UserMongoDBModule
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}


//mySQL & postgresQL & redis

@Module({
  imports: [
    ConfigModule.forRoot(), // Load .env
    ThrottlerModule.forRoot({
      throttlers: [{
        ttl: 60000,  // Thời gian sống tính bằng mili giây (60s = 60000ms)
        limit: 10,    // Số request tối đa
      }]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, RedisConfigModule, ],
      useFactory: (configService: ConfigService) => ({
        //  type: 'mysql',
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        // entities: [UserMySQLEnity],
        entities: [UserPostgreSQLEntity, BookGragQLPostgresQLEntity],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    // UserMySQLModule
    // UserPostgresQLModule, RedisConfigModule, GraphqlModule, BookModule
  ],
   controllers: [AppController],
   providers: [AppService, JwtService,  {
      provide: APP_GUARD,
      useClass: ThrottlerGuard ,
    },],
   exports: [JwtService],
})

export class AppModule {
   configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckTokenMiddleware)
      .forRoutes(
        { path: '/users', method: RequestMethod.GET }
      ); 
  }
}