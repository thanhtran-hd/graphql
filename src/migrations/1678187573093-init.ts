import { MigrationInterface, QueryRunner } from "typeorm";

export class init1678187573093 implements MigrationInterface {
    name = 'init1678187573093'

    public async up(queryRunner: QueryRunner): Promise<void> {
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\`
        `);
        await queryRunner.query(`
            DROP TABLE \`users\`
        `);
    }

}
