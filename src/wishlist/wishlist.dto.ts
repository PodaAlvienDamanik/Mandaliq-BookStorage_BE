// create-wishlist.dto.ts
import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWishlistDTO {
  @IsNumber()
  @ApiProperty({ example: 1 })
  book_id: number;
}
