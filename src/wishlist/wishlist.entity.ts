    import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
    import { User } from 'src/user/user.entity';
    import { Book } from 'src/book/book.entity';

    @Entity('wishlists')
    export class Wishlist {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column()
    book_id: number;

    @ManyToOne(() => User, user => user.wishlists)
    user: User;

    @ManyToOne(() => Book, book => book.wishlists)
    book: Book;
    }