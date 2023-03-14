import { MigrationInterface, QueryRunner } from "typeorm";

export class editorTableEdit1678386503299 implements MigrationInterface {
    name = 'editorTableEdit1678386503299'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`editors\` DROP FOREIGN KEY \`FK_285763f048a5713cbd5158893ed\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`editors\` DROP FOREIGN KEY \`FK_cd13be01fb01dd552e34a1a3d97\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`editors\` CHANGE \`event_id\` \`event_id\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`editors\` CHANGE \`user_id\` \`user_id\` int NOT NULL
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
            ALTER TABLE \`editors\` CHANGE \`user_id\` \`user_id\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`editors\` CHANGE \`event_id\` \`event_id\` int NULL
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

}
