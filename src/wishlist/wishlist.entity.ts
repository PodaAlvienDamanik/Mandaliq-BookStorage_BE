// wishlist.entity.ts (Corrected - Standard Pattern)
import {
    Column, // Keep Column for other fields if needed later
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Unique,
} from 'typeorm';
import { User } from '../user/user.entity'; // Adjust path
import { Book } from '../book/book.entity'; // Adjust path

@Entity('wishlist')
@Unique(['user', 'book']) // Uses property names 'user' and 'book'
export class Wishlist {
    @PrimaryGeneratedColumn()
    id: number;

    // --- User Relationship (Standard) ---
    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' }) // Physical DB column name is user_id
    user: User; // Property name is user

    // --- Book Relationship (Standard) ---
    // REMOVE the explicit @Column definition for id_book
    // @Column({ name: 'id_book', type: 'integer', nullable: false })
    // id_book: number;

    // Let @ManyToOne and @JoinColumn handle the FK implicitly
    @ManyToOne(() => Book, { nullable: false, eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_book' }) // Physical DB column name is id_book
    book: Book; // Property name is book

    // --- Timestamps ---
    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}