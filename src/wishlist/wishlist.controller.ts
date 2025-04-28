import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
    Req, // Keep Req
    UseGuards, // Import UseGuards
    ParseIntPipe, // Import ParseIntPipe
    HttpCode, // Import HttpCode
    HttpStatus, // Import HttpStatus
    NotFoundException, // Keep if needed for custom checks, but service handles core cases
} from '@nestjs/common';
import { JwtPayloadDto } from 'src/auth/dto/jwt-payload.dto'; // Adjust path
import { CreateWishlistDTO } from './wishlist.dto'; // Use correct DTO path/name
import { WishlistService } from './wishlist.service';
import { Wishlist } from './wishlist.entity';
import {
    ApiParam,
    ApiQuery,
    ApiTags, // Import ApiTags
    ApiOperation, // Import ApiOperation
    ApiResponse, // Import ApiResponse
    ApiBearerAuth, // Import ApiBearerAuth for protected routes
} from '@nestjs/swagger';

import { Request } from 'express'; // Import Request type
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('Wishlist') // Group in Swagger UI
@ApiBearerAuth() // Indicate that routes need Bearer token
@UseGuards(AuthGuard) // Protect all routes in this controller
@Controller('wishlist')
export class WishlistController {
    constructor(private readonly wishlistService: WishlistService) {}

    @Post()
    @ApiOperation({ summary: 'Add a book to the current user\'s wishlist' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Item added successfully.', type: Wishlist })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input (e.g., non-numeric bookId).' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Book with the specified ID not found.' })
    @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Book already exists in the wishlist.' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User not authenticated.' })
    async create(
        @Req() request: Request, // Use Express Request type
        @Body() createWishlistDto: CreateWishlistDTO, // Use correct DTO name
    ): Promise<Wishlist> {
        // Extract user ID from JWT payload attached by the guard
        const user = request.user as JwtPayloadDto;
        // Delegate directly to the service
        return this.wishlistService.create(user.sub, createWishlistDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get the current user\'s wishlist (paginated)' })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Page number' })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Items per page' })
    @ApiResponse({ status: HttpStatus.OK, description: 'List of wishlist items.', type: [Wishlist] })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User not authenticated.' })
    async findAll(
        @Req() request: Request,
        @Query('page', new ParseIntPipe({ optional: true })) page: number = 1, // Use ParseIntPipe
        @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    ): Promise<Wishlist[]> {
        const user = request.user as JwtPayloadDto;
        // Ensure page/limit are valid numbers if ParseIntPipe isn't strict enough
        const pageNum = page > 0 ? page : 1;
        const limitNum = limit > 0 ? limit : 10;
        return this.wishlistService.findByUserId(user.sub, pageNum, limitNum);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific wishlist item by ID for the current user' })
    @ApiParam({ name: 'id', type: Number, description: 'ID of the wishlist item' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Wishlist item details.', type: Wishlist })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Wishlist item not found for this user.' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User not authenticated.' })
    async findOne(
        @Req() request: Request,
        @Param('id', ParseIntPipe) id: number, // Use ParseIntPipe
    ): Promise<Wishlist> {
        const user = request.user as JwtPayloadDto;
        // Delegate to service, which handles NotFoundException
        return this.wishlistService.findOneByIdForUser(user.sub, id);
    }

    // Remove PUT /:id - Updating doesn't make sense for a simple wishlist link
    // @Put(':id') ...

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT) // Correct status for successful deletion
    @ApiOperation({ summary: 'Remove a book from the current user\'s wishlist' })
    @ApiParam({ name: 'id', type: Number, description: 'ID of the wishlist item to remove' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Item removed successfully.' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Wishlist item not found for this user.' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User not authenticated.' })
    async deleteOne(
        @Req() request: Request,
        @Param('id', ParseIntPipe) id: number, // Use ParseIntPipe
    ): Promise<void> {
        const user = request.user as JwtPayloadDto;
        // Delegate to service, which handles NotFoundException
        await this.wishlistService.remove(user.sub, id);
        // No explicit return needed for 204
    }
}