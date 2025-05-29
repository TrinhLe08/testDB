import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookService } from './book.service';
import { BookResolver } from './book.resolver';
import { BookGragQLPostgresQLEntity } from 'src/entities/book.grapQL.postgresql/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookGragQLPostgresQLEntity])],
  providers: [BookResolver, BookService],
  exports: [BookService],
})


export class BookModule {}