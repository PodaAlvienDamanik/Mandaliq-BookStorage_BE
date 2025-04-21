    // wishlist.controller.ts
    import { Controller, Post, Body, Req, Get } from '@nestjs/common';
    import { WishlistService } from './wishlist.service';
    import { CreateWishlistDTO } from './wishlist.dto';
    import { JwtPayloadDto } from 'src/auth/dto/jwt-payload.dto';

    @Controller('wishlist')
    export class WishlistController {
    constructor(private readonly wishlistService: WishlistService) {}

    @Post()
    async add(@Req() request: Request, @Body() dto: CreateWishlistDTO) {
        const user: JwtPayloadDto = request['user'];
        return this.wishlistService.addToWishlist(user.sub, dto);
    }

    @Get()
    async getAll(@Req() request: Request) {
        const user: JwtPayloadDto = request['user'];
        return this.wishlistService.findByUser(user.sub);
    }
    }
