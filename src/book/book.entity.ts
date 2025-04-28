// Entity: Book
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany, // Unused import
  ManyToOne,
  OneToMany, // Unused import
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '../categorybook/category.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  description: string;

  @CreateDateColumn()
  created_at: Date;

  // This defines the "Many Books" to "One Category" relationship
  @ManyToOne(() => Category, (category) => category.books, { // Links to 'books' property on Category entity
        onDelete: 'SET NULL', // If Category is deleted, set books.id_category to NULL
        nullable: true // Required for SET NULL. Allows books.id_category to be NULL
    })
  // This explicitly names the foreign key column in the 'books' table
  @JoinColumn({ name: 'id_category' })
  // This property holds the related Category object in your code
  category: Category;
}