    import { Injectable } from '@nestjs/common';
    import { Book } from './book.entity';
    import { Repository } from 'typeorm';
    import { InjectRepository } from '@nestjs/typeorm';

    @Injectable()
    export class BookService {
    constructor(
        @InjectRepository(Book) private bookRepository: Repository<Book>,
    ) {}

    async save(book: Book): Promise<Book> {
        return this.bookRepository.save(book);
    }

    async findByUserId(
        userId: number,
        page: number,
        limit: number,
    ): Promise<Book[]> {
        return await this.bookRepository.find({
        where: { user_id: userId },
        skip: (page - 1) * limit,
        take: limit,
        order: {
            created_at: 'DESC',
        },
        });
    }

    async findByUserIdAndBookId(userId: number, bookId: number): Promise<Book> {
        const book = await this.bookRepository.findOne({
        where: {
            user_id: userId,
            id: bookId,
        },
        });
        if (!book) {
        return new Book();
        }
        return book;
    }

    async deleteById(bookId: number) {
        await this.bookRepository.delete({ id: bookId });
    }
    }
