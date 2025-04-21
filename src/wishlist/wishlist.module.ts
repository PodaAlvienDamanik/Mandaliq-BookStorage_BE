    import { Module } from '@nestjs/common';
    import { TypeOrmModule } from '@nestjs/typeorm';
    import { Wishlist } from './wishlist.entity';
    import { WishlistService } from './wishlist.service';
    import { WishlistController } from './wishlist.controller';
    import { Book } from 'src/book/book.entity';

    @Module({
    imports: [TypeOrmModule.forFeature([Wishlist, Book])],
    controllers: [WishlistController],
    providers: [WishlistService],
    })
    export class WishlistModule {}
