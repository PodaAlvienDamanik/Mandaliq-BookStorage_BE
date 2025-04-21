    import { MigrationInterface, QueryRunner } from "typeorm";

    export class CreateCategoryBooksTable1745121494738 implements MigrationInterface {

        public async up(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.query(`
                CREATE TABLE categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) UNIQUE NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);
        }

        public async down(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.query(`DROP TABLE categories;`);
        }

    }
