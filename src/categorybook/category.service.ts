    import { Injectable, NotFoundException } from '@nestjs/common';
    import { InjectRepository } from '@nestjs/typeorm';
    import { Repository } from 'typeorm';
    import { CategoryBook } from './category.entity';

    @Injectable()
    export class CategoryBookService {
    constructor(
        @InjectRepository(CategoryBook)
        private categoryBookRepo: Repository<CategoryBook>,
    ) {}

    async create(category: CategoryBook): Promise<CategoryBook> {
        return this.categoryBookRepo.save(category);
    }

    async findAll(): Promise<CategoryBook[]> {
        return this.categoryBookRepo.find();
    }

    async findOne(id: number): Promise<CategoryBook> {
        const category = await this.categoryBookRepo.findOne({ where: { id } });
        if (!category) {
        throw new NotFoundException(`Category with id ${id} not found`);
        }
        return category;
    }

    async update(id: number, name: string): Promise<void> {
        await this.categoryBookRepo.update(id, { name });
    }

    async delete(id: number): Promise<void> {
        await this.categoryBookRepo.delete(id);
    }
    }
