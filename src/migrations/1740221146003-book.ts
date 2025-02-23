import { MigrationInterface, QueryRunner } from 'typeorm';

export class Book1740221146003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NULL,
        published_in INT NOT NULL,
        author_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_book_author FOREIGN KEY (author_id) REFERENCES authors(id)
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE books DROP CONSTRAINT IF EXISTS fk_book_author`);
    await queryRunner.query(`DROP TABLE IF EXISTS books`);
  }
}
