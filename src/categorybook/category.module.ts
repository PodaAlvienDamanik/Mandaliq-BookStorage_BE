    // Module
    import { Module } from '@nestjs/common';
    import { CategoryController } from './category.controller';
    import { CategoryService } from './category.service';
    import { TypeOrmModule } from '@nestjs/typeorm';
    import { Category } from './category.entity';
import { BookModule } from 'src/book/book.module';

    @Module({
    imports: [TypeOrmModule.forFeature([Category]), BookModule],
    controllers: [CategoryController],
    providers: [CategoryService],
    exports:[CategoryService],
    })
    export class CategoryModule {}