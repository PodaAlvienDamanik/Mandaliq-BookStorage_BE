

// dto/update-book.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsInt, Min, IsOptional } from 'class-validator';

export class UpdateBookDTO {
    @IsString()
    @IsOptional() // Mark fields as optional for updates
    @ApiPropertyOptional({ example: 'The Hobbit (Illustrated)', description: 'Updated title' })
    title?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ example: 'J.R.R. Tolkien', description: 'Updated author' })
    author?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ example: 'An updated fantasy novel...', description: 'Updated description' })
    description?: string;

    @IsNumber()
    @IsInt()
    @Min(1)
    @IsOptional()
    @ApiPropertyOptional({ example: 2, description: 'Updated category ID' })
    categoryId?: number; // Changed from id_category
}