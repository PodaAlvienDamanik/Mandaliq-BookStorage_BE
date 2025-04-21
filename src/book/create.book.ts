    import { ApiProperty } from "@nestjs/swagger";
    import { IsNotEmpty, IsString } from "class-validator";

    export class CreateBookDTO {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    title: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    author: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    description: string;

    @ApiProperty()
    imageUrl: string;
    }
