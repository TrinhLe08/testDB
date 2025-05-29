import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookGragQLPostgresQLEntity } from 'src/entities/book.grapQL.postgresql/book.entity';
import { CreateBookInputGragQL } from 'src/entities/book.grapQL.postgresql/dto/create-book.input';
import { Repository } from 'typeorm';


@Injectable()
export class BookService {
    constructor(
        @InjectRepository(BookGragQLPostgresQLEntity)
        private booksRepository: Repository<BookGragQLPostgresQLEntity>,
    ) {}

    async findAll(): Promise<BookGragQLPostgresQLEntity[]> {
        return this.booksRepository.find();
    }

    async findOne(id: string): Promise<BookGragQLPostgresQLEntity | undefined> {
        return this.booksRepository.findOneBy({ id });
    }

    async create(createBookInput: CreateBookInputGragQL): Promise<BookGragQLPostgresQLEntity> {
        const newBook = this.booksRepository.create({
            ...createBookInput,
            createdAt: new Date(),
        });
        return this.booksRepository.save(newBook);
    }

    async update(id: string, updateBookInput: CreateBookInputGragQL): Promise<BookGragQLPostgresQLEntity> {
        const book = await this.findOne(id);
        if (!book) {
            throw new Error('Book not found');
        }
        Object.assign(book, updateBookInput);
        return this.booksRepository.save(book);
    }

    async remove(id: string): Promise<boolean> {
        const result = await this.booksRepository.delete(id);
        return result.affected > 0; // Trả về true nếu có cuốn sách bị xóa
    }
}