import { Injectable } from '@nestjs/common';
import { BookGragQLPostgresQL } from 'src/entities/book.grapQL.postgresql/book.entity';
import { CreateBookInputGragQL } from 'src/entities/book.grapQL.postgresql/dto/create-book.input';

@Injectable()
export class BookService {
  private books: BookGragQLPostgresQL[] = []; // In-memory store for demo

  findAll(): BookGragQLPostgresQL[] {
    return this.books;
  }

  findOne(id: string): BookGragQLPostgresQL | undefined {
    return this.books.find(book => book.id === id);
  }

  create(createBookInput: CreateBookInputGragQL): BookGragQLPostgresQL {
    const newBook: BookGragQLPostgresQL = {
      id: Date.now().toString(),
      createdAt: new Date(),
      ...createBookInput,
    };
    this.books.push(newBook);
    return newBook;
  }

  update(id: string, updateBookInput: CreateBookInputGragQL): BookGragQLPostgresQL {
    const index = this.books.findIndex(book => book.id === id);
    if (index === -1) {
      throw new Error('Book not found');
    }
    this.books[index] = { ...this.books[index], ...updateBookInput };
    return this.books[index];
  }

  remove(id: string): boolean {
    const initialLength = this.books.length;
    this.books = this.books.filter(book => book.id !== id);
    return this.books.length !== initialLength;
  }
}