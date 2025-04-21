    import {
        Entity,
        PrimaryGeneratedColumn,
        Column,
        CreateDateColumn,
        UpdateDateColumn,
        OneToMany,
    } from 'typeorm';
    import { Book } from 'src/book/book.entity';
    
    @Entity('category_books')
    export class CategoryBook {
        @PrimaryGeneratedColumn()
        id: number;
    
        @Column()
        name: string;
    
        @CreateDateColumn()
        created_at: Date;
    
        @UpdateDateColumn()
        updated_at: Date;
    
        // Optional: Relasi ke Book
        @OneToMany(() => Book, (book) => book.category)
        books: Book[];
    }
    