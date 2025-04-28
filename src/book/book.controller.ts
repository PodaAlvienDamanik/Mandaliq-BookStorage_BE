    // book.controller.ts (Refactored)
    import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    ParseIntPipe, // For validating numeric route params
    HttpCode,
    HttpStatus,
    NotFoundException, // Keep import if needed elsewhere, but service handles core cases
    } from '@nestjs/common';
    import { ApiParam, ApiQuery, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
    import { BookService } from './book.service';
    import { Book } from './book.entity';
    import { CreateBookDTO } from './create.book';
    import { UpdateBookDTO } from './UpdateBookDto';


    @ApiTags('Books') // Group in Swagger
    @Controller('books')
    export class BookController {
    constructor(private readonly bookService: BookService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new book' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Book created successfully.', type: Book })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Category specified not found.' })
    async create(@Body() createBookDto: CreateBookDTO): Promise<Book> {
        // Directly delegate to the service, passing the DTO
        // Service will handle entity creation and relationship assignment
        return this.bookService.create(createBookDto); // Assuming service has 'create'
    }

    @Get()
    @ApiOperation({ summary: 'Get all books with pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Page number' })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Items per page' })
    @ApiResponse({ status: HttpStatus.OK, description: 'List of books.', type: [Book] })
    async findAll(
        // Use ParseIntPipe with optional flag if desired, or handle defaults as before
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ): Promise<Book[]> { // Consider returning a pagination object { data: Book[], count: number }
        // Ensure page/limit are numbers if not using ParseIntPipe
        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 10;
        return this.bookService.findAll(pageNum, limitNum); // Assuming service handles pagination
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a book by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'ID of the book' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Book details.', type: Book })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Book not found.' })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Book> {
        // Delegate to service. Service's findOneById should throw NotFoundException.
        return this.bookService.findOneById(id); // Assuming service has 'findOneById'
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a book by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'ID of the book' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Book updated successfully.', type: Book })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Book or specified Category not found.' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateBookDto: UpdateBookDTO, // Use UpdateBookDTO
    ): Promise<Book> {
        // Delegate to service. Service's update should handle finding, updating, saving, and errors.
        return this.bookService.update(id, updateBookDto); // Assuming service has 'update'
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT) // Correct status code for successful deletion
    @ApiOperation({ summary: 'Delete a book by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'ID of the book' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Book deleted successfully.' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Book not found.' })
    async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        // Delegate to service. Service's remove/deleteById should handle finding and errors.
        await this.bookService.remove(id); // Assuming service has 'remove' or 'deleteById'
    }
    }