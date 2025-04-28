// Service: category.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDTO } from './create-category';
import { UpdateCategoryDTO } from './UpdateCategoryDTO';


@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}

    /**
     * Creates and saves a new category.
     * Assumes category names should be unique.
     * @param createCategoryDto - DTO containing the category name.
     * @returns The newly created Category entity.
     * @throws ConflictException if a category with the same name already exists.
     */
    async create(createCategoryDto: CreateCategoryDTO): Promise<Category> {
        const { name } = createCategoryDto;

        const existingCategory = await this.categoryRepository.findOneBy({ name });
        if (existingCategory) {
            throw new ConflictException(`Category with name "${name}" already exists.`);
        }

        const newCategory = this.categoryRepository.create({ name });
        return this.categoryRepository.save(newCategory);
    }

    /**
     * Finds all categories, optionally including related books.
     * @returns A promise resolving to an array of Category entities.
     */
    async findAll(): Promise<Category[]> {
        return await this.categoryRepository.find({
            relations: ['books'], // Use the correct relation name from your Category entity
            order: { name: 'ASC' },
        });
    }

    /**
     * Finds a single category by its ID, optionally including related books.
     * @param id - The ID of the category to find.
     * @returns A promise resolving to the Category entity.
     * @throws NotFoundException if the category doesn't exist.
     */
    async findOneById(id: number): Promise<Category> {
         const category = await this.categoryRepository.findOne({
             where: { id },
             relations: ['books'], // Use the correct relation name from your Category entity
         });
         if (!category) {
             throw new NotFoundException(`Category with ID ${id} not found.`);
         }
         return category;
    }

    /**
     * Updates an existing category by its ID.
     * @param id - The ID of the category to update.
     * @param updateCategoryDto - DTO containing the fields to update.
     * @returns The updated Category entity.
     * @throws NotFoundException if the category with the given ID does not exist.
     * @throws ConflictException if the updated name conflicts with another existing category.
     */
    async update(id: number, updateCategoryDto: UpdateCategoryDTO): Promise<Category> {
        // 1. Find the existing category entity first.
        // We use `preload` which finds the entity by ID and returns it,
        // or returns undefined if not found. It's slightly more geared towards updates
        // than `findOneBy`, but `findOneBy` works perfectly well too.
        // Alternatively, just use the existing `findOneById(id)` which already handles NotFound.
        // const category = await this.findOneById(id);

        // Let's use findOneBy directly to avoid making two separate queries if findOneById also loads relations
        const category = await this.categoryRepository.findOneBy({ id });
        if (!category) {
            // Throw NotFoundException if the category doesn't exist
             throw new NotFoundException(`Category with ID ${id} not found.`);
        }


        // 2. Check for potential name conflicts (only if name is being changed)
        if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
            const existingCategoryWithName = await this.categoryRepository.findOneBy({
                 name: updateCategoryDto.name,
            });

            // If a category with the *new* name exists, AND it's *not* the same category we are currently updating
            if (existingCategoryWithName && existingCategoryWithName.id !== id) {
                throw new ConflictException(`Category with name "${updateCategoryDto.name}" already exists.`);
            }
        }

        // 3. Merge the changes from the DTO into the loaded category entity.
        // `merge` updates the `category` object in memory with properties from the DTO.
        // It only updates fields present in the DTO.
        this.categoryRepository.merge(category, updateCategoryDto);

        // 4. Save the updated entity back to the database.
        // `save` performs the actual UPDATE query in the database.
        return this.categoryRepository.save(category);
    }


    /**
     * Deletes a category by its ID.
     * Note: Behavior on deletion depends on the relationship's cascade/constraint options.
     * @param id - The ID of the category to delete.
     * @returns A promise resolving when the deletion is complete.
     * @throws NotFoundException if the category doesn't exist.
     */
    async deleteById(id: number): Promise<void> {
        const result = await this.categoryRepository.delete({ id });
        if (result.affected === 0) {
            throw new NotFoundException(`Category with ID ${id} not found.`);
        }
    }
}