import { MigrationInterface, QueryRunner } from "typeorm";

export class init1678247023901 implements MigrationInterface {
    name = 'init1678247023901'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`events\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(255) NOT NULL,
                \`description\` varchar(255) NOT NULL,
                \`maximum\` int NOT NULL,
                \`quantity\` int NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`vouchers\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`code\` varchar(255) NOT NULL,
                \`user_id\` int NULL,
                \`event_id\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`users\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`email\` varchar(255) NOT NULL,
                \`hashed_password\` varchar(255) NOT NULL,
                \`fullname\` varchar(255) NOT NULL,
                \`role\` enum ('admin', 'author') NOT NULL DEFAULT 'author',
                UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`vouchers\`
            ADD CONSTRAINT \`FK_8e600761fcb8b897f1c6ddd78c0\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`vouchers\`
            ADD CONSTRAINT \`FK_7d0750f707e788388cd5b90838d\` FOREIGN KEY (\`event_id\`) REFERENCES \`events\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`vouchers\` DROP FOREIGN KEY \`FK_7d0750f707e788388cd5b90838d\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`vouchers\` DROP FOREIGN KEY \`FK_8e600761fcb8b897f1c6ddd78c0\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\`
        `);
        await queryRunner.query(`
            DROP TABLE \`users\`
        `);
        await queryRunner.query(`
            DROP TABLE \`vouchers\`
        `);
        await queryRunner.query(`
            DROP TABLE \`events\`
        `);
    }

}
