// DTO: update-category.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class UpdateCategoryDTO {
    @IsString()
    @IsNotEmpty()
    @IsOptional() // Name is optional during update
    @ApiPropertyOptional({ example: 'Science Fiction', description: 'The updated name of the category' })
    name?: string;


}