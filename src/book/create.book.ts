// dto/create-book.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsInt, Min } from 'class-validator';

export class CreateBookDTO {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'The Hobbit', description: 'Title of the book' })
    title: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'J.R.R. Tolkien', description: 'Author of the book' })
    author: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'A fantasy novel...', description: 'Book description' })
    description: string;

    @IsNumber()
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @ApiProperty({ example: 1, description: 'ID of the category the book belongs to' })
    categoryId: number; // Changed from id_category for consistency
}