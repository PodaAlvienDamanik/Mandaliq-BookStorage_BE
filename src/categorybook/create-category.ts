
// DTO: CreateCategoryDTO
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCategoryDTO {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;
}