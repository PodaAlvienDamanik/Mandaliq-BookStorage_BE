// wishlist.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { Wishlist } from './wishlist.entity';
import { User } from '../user/user.entity'; // Adjust path
import { Book } from '../book/book.entity'; // Adjust path
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';
// Import AuthModule if JWT Guard/Strategy is defined there
// import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        Wishlist,
        User, // Needed for relation in Wishlist Entity & potentially service
        Book  // Needed for relation & validation in WishlistService
      ]),
    // AuthModule // Import AuthModule if needed for JwtAuthGuard dependency resolution
  ],
  controllers: [WishlistController],
  providers: [WishlistService, 
    ConfigService,
    JwtService,
    { provide: APP_GUARD, useClass: AuthGuard },

  ],
})
export class WishlistModule {}