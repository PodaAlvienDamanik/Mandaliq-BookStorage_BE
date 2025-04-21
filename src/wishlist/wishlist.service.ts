    import { Injectable, NotFoundException } from '@nestjs/common';
    import { InjectRepository } from '@nestjs/typeorm';
    import { Repository } from 'typeorm';
    import { Wishlist } from './wishlist.entity';
    import { CreateWishlistDTO } from './wishlist.dto';
    import { Book } from 'src/book/book.entity';

    @Injectable()
    export class WishlistService {
    constructor(
        @InjectRepository(Wishlist)
        private wishlistRepo: Repository<Wishlist>,

        @InjectRepository(Book)
        private bookRepo: Repository<Book>,
    ) {}

    async addToWishlist(userId: number, dto: CreateWishlistDTO): Promise<Wishlist> {
        const book = await this.bookRepo.findOne({ where: { id: dto.book_id } });

        if (!book) {
        throw new NotFoundException('Buku tidak ditemukan');
        }

        const wishlist = this.wishlistRepo.create({
        user_id: userId,
        book_id: dto.book_id,
        book: book,
        });

        return await this.wishlistRepo.save(wishlist);
    }

    async findByUser(userId: number): Promise<Wishlist[]> {
        return await this.wishlistRepo.find({
        where: { user_id: userId },
        relations: ['book'],
        });
    }
    }
