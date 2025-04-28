// book.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Ensure TypeOrmModule is imported
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { Book } from './book.entity';
import { Category } from '../categorybook/category.entity'; // <--- Import the Category entity

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Book,     // Makes Repository<Book> available in this module
      Category  // <--- ADD Category HERE
                // This makes Repository<Category> available in this module
    ])
  ],
  controllers: [BookController],
  providers: [BookService],
  // exports: [] // Only needed if other modules need to use BookService/Repositories defined here
})
export class BookModule {}