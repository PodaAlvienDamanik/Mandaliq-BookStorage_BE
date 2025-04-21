    import { IsNotEmpty, IsString } from 'class-validator';
    import { ApiProperty } from '@nestjs/swagger';

    export class CreateCategoryBookDTO {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'Fiction' })
    name: string;
    }
