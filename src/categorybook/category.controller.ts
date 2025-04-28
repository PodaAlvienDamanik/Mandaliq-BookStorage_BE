// Controller: category.controller.ts
import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException, // Keep for potential direct use, though service handles primary cases
    Param,
    Post,
    Put,
    ParseIntPipe, // Use built-in pipe for ID parsing/validation
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.entity';

import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateCategoryDTO } from './create-category';
import { UpdateCategoryDTO } from './UpdateCategoryDTO';

@ApiTags('Categories') // Group endpoints in Swagger UI
@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new category' })
    @ApiResponse({ status: 201, description: 'The category has been successfully created.', type: Category })
    @ApiResponse({ status: 400, description: 'Bad Request (validation error).' })
    @ApiResponse({ status: 409, description: 'Conflict (category name already exists).' }) // If service throws ConflictException
    async create(@Body() createCategoryDto: CreateCategoryDTO): Promise<Category> {
        // Directly call the service method, passing the DTO
        // No need to manually create `new Category()` here
        return this.categoryService.create(createCategoryDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all categories' })
    @ApiResponse({ status: 200, description: 'List of all categories.', type: [Category] })
    async findAll(): Promise<Category[]> {
        return this.categoryService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a category by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'ID of the category to retrieve' })
    @ApiResponse({ status: 200, description: 'The category details.', type: Category })
    @ApiResponse({ status: 404, description: 'Category not found.' })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Category> {
        // Service method findOneById already throws NotFoundException if not found
        return this.categoryService.findOneById(id);
        // No need for the redundant check:
        // const category = await this.categoryService.findOneById(id);
        // if (!category) {
        //     throw new NotFoundException(`Category with ID ${id} not found.`);
        // }
        // return category;
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a category by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'ID of the category to update' })
    @ApiResponse({ status: 200, description: 'The category has been successfully updated.', type: Category })
    @ApiResponse({ status: 400, description: 'Bad Request (validation error).' })
    @ApiResponse({ status: 404, description: 'Category not found.' })
    @ApiResponse({ status: 409, description: 'Conflict (category name already exists).' }) // If service handles name conflicts on update
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCategoryDto: UpdateCategoryDTO,
    ): Promise<Category> {
        
        return this.categoryService.update(id, updateCategoryDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT) // Correct HTTP status for successful deletion with no body
    @ApiOperation({ summary: 'Delete a category by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'ID of the category to delete' })
    @ApiResponse({ status: 204, description: 'The category has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Category not found.' })
    async deleteOne(@Param('id', ParseIntPipe) id: number): Promise<void> {
        // Service method deleteById already throws NotFoundException if not found
        await this.categoryService.deleteById(id);
        // No need for the redundant check:
        // const category = await this.categoryService.findOneById(id); // Inefficient check
        // if (!category) {
        //     throw new NotFoundException(`Category with ID ${id} not found.`);
        // }
        // await this.categoryService.deleteById(id);
    }
}