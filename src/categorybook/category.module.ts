    import { Module } from '@nestjs/common';
    import { TypeOrmModule } from '@nestjs/typeorm';
    import { CategoryBook } from './category.entity';
    import { CategoryBookService } from './category.service';
    import { CategoryBookController } from './category.controller';

    @Module({
    imports: [TypeOrmModule.forFeature([CategoryBook])],
    controllers: [CategoryBookController],
    providers: [CategoryBookService],
    })
    export class CategoryBookModule {}
