import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { BookGragQLPostgresQLEntity } from 'src/entities/book.grapQL.postgresql/book.entity';
import { BookService } from './book.service';
import { CreateBookInputGragQL } from 'src/entities/book.grapQL.postgresql/dto/create-book.input';

@Resolver(() => BookGragQLPostgresQLEntity)
export class BookResolver {
  constructor(private readonly bookService: BookService) {}

  @Query(() => [BookGragQLPostgresQLEntity], { name: 'books' })
  findAll() {
    return this.bookService.findAll();
  }

  @Query(() => BookGragQLPostgresQLEntity, { name: 'book', nullable: true })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.bookService.findOne(id);
  }

  @Mutation(() => BookGragQLPostgresQLEntity)
  createBook(@Args('createBookInput') createBookInput: CreateBookInputGragQL) {
    return this.bookService.create(createBookInput);
  }

  @Mutation(() => BookGragQLPostgresQLEntity)
  updateBook(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateBookInput') updateBookInput: CreateBookInputGragQL // Simplified for example
  ) {
    return this.bookService.update(id, updateBookInput);
  }

  @Mutation(() => Boolean)
  removeBook(@Args('id', { type: () => ID }) id: string) {
    return this.bookService.remove(id);
  }
}