import { MigrationInterface, QueryRunner } from 'typeorm';

export class rolesPermissions1740429663388 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE roles (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL UNIQUE
      )
    `);
    await queryRunner.query(`CREATE TABLE permissions (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL UNIQUE
      )
    `);
    await queryRunner.query(`CREATE TABLE users_roles (
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role_id INT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
        PRIMARY KEY (user_id, role_id)
      )
    `);
    await queryRunner.query(`CREATE TABLE roles_permissions (
        role_id INT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
        permission_id INT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
        PRIMARY KEY (role_id, permission_id)
      )
    `);
    await queryRunner.query(`
        INSERT INTO roles (title) VALUES ('user'), ('admin')
        ON CONFLICT (title) DO NOTHING;
      )
    `);
    await queryRunner.query(`
        INSERT INTO permissions (title) VALUES ('read'), ('edit')
        ON CONFLICT (title) DO NOTHING;
      )
    `);
    await queryRunner.query(`
        INSERT INTO roles_permissions (role_id, permission_id)
        SELECT r.id, p.id FROM roles r, permissions p
        WHERE r.title = 'user' AND p.title = 'read'
        ON CONFLICT DO NOTHING;
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }
}
