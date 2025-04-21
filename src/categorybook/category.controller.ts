    import {
        Body,
        Controller,
        Get,
        Post,
        Param,
        Put,
        Delete,
        NotFoundException,
    } from '@nestjs/common';
    import { CategoryBookService } from './category.service';
    import { CreateCategoryBookDTO } from './create-category';
    import { CategoryBook } from './category.entity';
    import { ApiTags } from '@nestjs/swagger';
    
    @ApiTags('Category Book')
    @Controller('category-book')
    export class CategoryBookController {
        constructor(private readonly categoryBookService: CategoryBookService) {}
    
        @Post()
        async create(@Body() dto: CreateCategoryBookDTO): Promise<CategoryBook> {
        const category = new CategoryBook();
        category.name = dto.name;
        return this.categoryBookService.create(category);
        }
    
        @Get()
        async findAll(): Promise<CategoryBook[]> {
        return this.categoryBookService.findAll();
        }
    
        @Get(':id')
        async findOne(@Param('id') id: number): Promise<CategoryBook> {
        const category = await this.categoryBookService.findOne(id);
        if (!category) {
            throw new NotFoundException(`Category with id ${id} not found`);
        }
        return category;
        }
    
        @Put(':id')
        async update(@Param('id') id: number, @Body() dto: CreateCategoryBookDTO) {
        const category = await this.categoryBookService.findOne(id);
        if (!category) {
            throw new NotFoundException(`Category with id ${id} not found`);
        }
        return this.categoryBookService.update(id, dto.name);
        }
    
        @Delete(':id')
        async delete(@Param('id') id: number) {
        const category = await this.categoryBookService.findOne(id);
        if (!category) {
            throw new NotFoundException(`Category with id ${id} not found`);
        }
        return this.categoryBookService.delete(id);
        }
    }
    