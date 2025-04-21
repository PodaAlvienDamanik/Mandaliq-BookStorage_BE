    import { CategoryBook } from 'src/categorybook/category.entity';
    import { Wishlist } from 'src/wishlist/wishlist.entity';
    import {
        Column,
        CreateDateColumn,
        ManyToOne,
        Entity,
        PrimaryGeneratedColumn,
        UpdateDateColumn,
        OneToMany,
    } from 'typeorm';
    
    @Entity('books')
    export class Book {
        @PrimaryGeneratedColumn()
        id: number;
    
        @Column()
        user_id: number;
    
        @Column()
        title: string;
    
        @Column()
        author: string;
    
        @Column()
        description: string;
    
        @Column()
        image_url: string;
    
        @CreateDateColumn()
        created_at: Date;
    
        @UpdateDateColumn()
        updated_at: Date;

        @Column()
        category_id: number;

        @ManyToOne(() => CategoryBook, (category) => category.books)
        category: CategoryBook;

        @OneToMany(() => Wishlist, wishlist => wishlist.book)
        wishlists: Wishlist[];
    }
    