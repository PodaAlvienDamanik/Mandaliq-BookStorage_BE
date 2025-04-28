import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBooksTable1745678942685 implements MigrationInterface {

    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE books (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                author VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                id_category INTEGER NOT NULL,
                created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_categories FOREIGN KEY(id_category) REFERENCES categories(id) ON DELETE CASCADE
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE books;`);
    }

}
