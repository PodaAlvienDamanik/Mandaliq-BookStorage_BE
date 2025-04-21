    import {
        Body,
        Controller,
        Delete,
        Get,
        NotFoundException,
        Param,
        Post,
        Put,
        Query,
        Req,
    } from '@nestjs/common';
    import { JwtPayloadDto } from 'src/auth/dto/jwt-payload.dto';
    import { CreateBookDTO } from './create.book';
    import { BookService } from './book.service';
    import { Book } from './book.entity';
    import { ApiParam, ApiQuery } from '@nestjs/swagger';
    
    @Controller('book')
    export class BookController {
        constructor(private readonly bookService: BookService) {}
    
        @Post()
        async create(@Req() request: Request, @Body() createBookDTO: CreateBookDTO) {
        const book: Book = new Book();
        const userJwtPayload: JwtPayloadDto = request['user'];
        book.title = createBookDTO.title;
        book.author = createBookDTO.author;
        book.description = createBookDTO.description;
        book.image_url = createBookDTO.imageUrl;
        book.user_id = userJwtPayload.sub;
        await this.bookService.save(book);
        }
    
        @Get()
        @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
        @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
        async findAll(
        @Req() request: Request,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        ): Promise<Book[]> {
        const userJwtPayload: JwtPayloadDto = request['user'];
        return await this.bookService.findByUserId(userJwtPayload.sub, page, limit);
        }
    
        @Get(':id')
        @ApiParam({ name: 'id', type: Number, description: 'ID of the book' })
        async findOne(
        @Req() request: Request,
        @Param('id') id: number,
        ): Promise<Book> {
        const userJwtPayload: JwtPayloadDto = request['user'];
        return await this.bookService.findByUserIdAndBookId(userJwtPayload.sub, id);
        }
    
        @Put(':id')
        @ApiParam({ name: 'id', type: Number, description: 'ID of the book' })
        async updateOne(
        @Req() request: Request,
        @Param('id') id: number,
        @Body() createBookDTO: CreateBookDTO,
        ) {
        const userJwtPayload: JwtPayloadDto = request['user'];
        const book: Book = await this.bookService.findByUserIdAndBookId(
            userJwtPayload.sub,
            id,
        );
        if (!book?.id) {
            throw new NotFoundException();
        }
        book.title = createBookDTO.title;
        book.author = createBookDTO.author;
        book.description = createBookDTO.description;
        book.image_url = createBookDTO.imageUrl;
        await this.bookService.save(book);
        }
    
        @Delete(':id')
        @ApiParam({ name: 'id', type: Number, description: 'ID of the book' })
        async deleteOne(@Req() request: Request, @Param('id') id: number) {
        const userJwtPayload: JwtPayloadDto = request['user'];
        const book: Book = await this.bookService.findByUserIdAndBookId(
            userJwtPayload.sub,
            id,
        );
        if (!book?.id) {
            throw new NotFoundException();
        }
        await this.bookService.deleteById(id);
        }
    }
    