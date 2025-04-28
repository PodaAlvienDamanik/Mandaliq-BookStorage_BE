// book.service.ts (Illustrative Implementations)
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Book } from './book.entity';

import { Category } from '../categorybook/category.entity'; // Adjust path
import { CreateBookDTO } from './create.book';
import { UpdateBookDTO } from './UpdateBookDto';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>,
        // Optional: Inject Category repository ONLY if you need to validate categoryId on create/update
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}

    async create(createBookDto: CreateBookDTO): Promise<Book> {
        const { categoryId, ...bookData } = createBookDto;

        // **Optional but Recommended: Validate category exists**
        const categoryExists = await this.categoryRepository.findOneBy({ id: categoryId });
        if (!categoryExists) {
            throw new NotFoundException(`Category with ID ${categoryId} not found.`);
        }

        const book = this.bookRepository.create({
            ...bookData,
            category: { id: categoryId }, // Correct way to link by ID
        });
        return this.bookRepository.save(book);
    }

    async findAll(page: number, limit: number): Promise<Book[]> {
        const skip = (page - 1) * limit;
        return this.bookRepository.find({
            relations: ['category'], // Eager load category info
            skip: skip,
            take: limit,
            order: { title: 'ASC' }, // Example ordering
        });
        // For total count (for pagination response):
        // const [data, total] = await this.bookRepository.findAndCount({ ... });
        // return { data, total };
    }

    async findOneById(id: number): Promise<Book> {
        const book = await this.bookRepository.findOne({
             where: { id },
             relations: ['category'], // Load relation
        });
        if (!book) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }
        return book;
    }

    async update(id: number, updateBookDto: UpdateBookDTO): Promise<Book> {
        const { categoryId, ...bookData } = updateBookDto;

        // Preload finds the entity and merges the DTO automatically.
        // Or use findOneById first, then merge.
        const book = await this.bookRepository.preload({
            id: id,
            ...bookData,
            // Only include category if categoryId is present in the DTO
            ...(categoryId !== undefined && { category: { id: categoryId } }),
        });

        if (!book) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }

        // **Optional but Recommended: Validate category exists if it's being changed**
        if (categoryId !== undefined) {
            const categoryExists = await this.categoryRepository.findOneBy({ id: categoryId });
            if (!categoryExists) {
                throw new NotFoundException(`Category with ID ${categoryId} not found.`);
            }
            // Note: Preload already assigned category: {id: categoryId} if provided
        }

        return this.bookRepository.save(book);
    }

    async remove(id: number): Promise<void> {
        const result = await this.bookRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }
    }
}