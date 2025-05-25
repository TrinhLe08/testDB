import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserMongoDBModule } from './module/user.mongoDB/user.module';
import { UserMySQLEnity } from './entities/user.entity.mysql';
import { UserMySQLModule } from './module/user.mySQL/user.module';
import { UserPostgresQLEnity } from './entities/user.entity.postgresql';
import { UserPostgresQLModule } from './module/user.postgresSQL/user.module';

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



//mySQL & postgresQL 

@Module({
  imports: [
    ConfigModule.forRoot(), // Load .env
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        //  type: 'mysql',
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        // entities: [UserMySQLEnity],
        entities: [UserPostgresQLEnity],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    // UserMySQLModule
    UserPostgresQLModule
  ],
})
export class AppModule {}