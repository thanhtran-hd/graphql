import { MigrationInterface, QueryRunner } from "typeorm";

export class editorTable1678359476824 implements MigrationInterface {
    name = 'editorTable1678359476824'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`editors\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`expired_at\` datetime NOT NULL,
                \`user_id\` int NULL,
                \`event_id\` int NULL,
                UNIQUE INDEX \`unique event\` (\`event_id\`),
                UNIQUE INDEX \`REL_cd13be01fb01dd552e34a1a3d9\` (\`user_id\`),
                UNIQUE INDEX \`REL_285763f048a5713cbd5158893e\` (\`event_id\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`editors\`
            ADD CONSTRAINT \`FK_cd13be01fb01dd552e34a1a3d97\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`editors\`
            ADD CONSTRAINT \`FK_285763f048a5713cbd5158893ed\` FOREIGN KEY (\`event_id\`) REFERENCES \`events\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`editors\` DROP FOREIGN KEY \`FK_285763f048a5713cbd5158893ed\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`editors\` DROP FOREIGN KEY \`FK_cd13be01fb01dd552e34a1a3d97\`
        `);
        await queryRunner.query(`
            DROP INDEX \`REL_285763f048a5713cbd5158893e\` ON \`editors\`
        `);
        await queryRunner.query(`
            DROP INDEX \`REL_cd13be01fb01dd552e34a1a3d9\` ON \`editors\`
        `);
        await queryRunner.query(`
            DROP INDEX \`unique event\` ON \`editors\`
        `);
        await queryRunner.query(`
            DROP TABLE \`editors\`
        `);
    }

}
