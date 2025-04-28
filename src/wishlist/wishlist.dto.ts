import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsInt, Min } from 'class-validator';

export class CreateWishlistDTO {
    // Remove title and author
    // @IsString() ... title: string;
    // @IsString() ... author: string;

    @IsNumber()
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @ApiProperty({
        description: 'The ID of the Book to add to the wishlist',
        example: 15,
    })
    bookId: number; // Accept the Book's ID
}