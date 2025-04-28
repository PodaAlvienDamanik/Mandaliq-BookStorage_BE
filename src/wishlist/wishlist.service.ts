// wishlist.service.ts (Adjusted create method)
import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { Wishlist } from './wishlist.entity';
import { Repository, FindOptionsWhere } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../book/book.entity';
import { CreateWishlistDTO } from './wishlist.dto';

@Injectable()
export class WishlistService {
    constructor(
        @InjectRepository(Wishlist)
        private readonly wishlistRepository: Repository<Wishlist>,
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>,
    ) {}

    async create(
        userId: number,
        createWishlistDto: CreateWishlistDTO,
    ): Promise<Wishlist> {
        const { bookId } = createWishlistDto;

        const bookExists = await this.bookRepository.findOneBy({ id: bookId });
        if (!bookExists) {
            throw new NotFoundException(`Book with ID ${bookId} not found.`);
        }

        // Check for existing item using relation properties
        const existingWishlistItem = await this.wishlistRepository.findOneBy({
            user: { id: userId }, // Use 'user' property
            book: { id: bookId }, // Use 'book' property
        });

        if (existingWishlistItem) {
            throw new ConflictException(
                `Book with ID ${bookId} is already in the wishlist.`,
            );
        }

        // Create new item using relation properties
        // *** CORRECTED HERE ***
        const newWishlistItem = this.wishlistRepository.create({
            user: { id: userId }, // Assign user relation by ID
            book: { id: bookId }, // Assign book relation by ID
            // No longer assigning id_book directly as it's not a property
        });

        const savedItem = await this.wishlistRepository.save(newWishlistItem);

        // Fetch the full item to return (important if book wasn't eager loaded correctly)
        return this.findOneByIdForUser(userId, savedItem.id);
    }

    // --- findByUserId --- remains the same, already uses 'user' property
    async findByUserId(
        userId: number,
        page: number,
        limit: number,
    ): Promise<Wishlist[]> {
        const skip = (page - 1) * limit;
        return await this.wishlistRepository.find({
            where: { user: { id: userId } }, // Correct: Uses 'user' property
            relations: ['book'], // Load relation if not eager
            skip: skip,
            take: limit,
            order: {
                created_at: 'DESC',
            },
        });
    }

    // --- findOneByIdForUser --- remains the same, already uses 'user' property
    async findOneByIdForUser(
        userId: number,
        wishlistId: number,
    ): Promise<Wishlist> {
        const wishlistItem = await this.wishlistRepository.findOne({
            where: {
                id: wishlistId,
                user: { id: userId }, // Correct: Uses 'user' property
            },
            relations: ['book'], // Load relation if not eager
        });
        if (!wishlistItem) {
            throw new NotFoundException(
                `Wishlist item with ID ${wishlistId} not found for this user.`,
            );
        }
        return wishlistItem;
    }

     // --- remove --- remains the same, already uses 'user' property
    async remove(userId: number, wishlistId: number): Promise<void> {
        const result = await this.wishlistRepository.delete({
            id: wishlistId,
            user: { id: userId }, // Correct: Uses 'user' property
        });
        if (result.affected === 0) {
            throw new NotFoundException(
                `Wishlist item with ID ${wishlistId} not found for this user.`,
            );
        }
    }
}