    import { MigrationInterface, QueryRunner } from "typeorm";

    export class CreateWishlistTable1745121513921 implements MigrationInterface {

        public async up(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.query(`
                CREATE TABLE wishlists (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                book_id INTEGER NOT NULL,
                note TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
                CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
                CONSTRAINT fk_book FOREIGN KEY(book_id) REFERENCES books(id) ON DELETE CASCADE
                );
            `);
        }

        public async down(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.query(`DROP TABLE wishlists;`);
        }

    }
