import {MigrationInterface, QueryRunner} from "typeorm";

export class Initialise implements MigrationInterface {
    name = 'Initialise'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("INSERT INTO user(email,password) VALUES('admin@gmail.com','')");
    }

    public async down(): Promise<void> { 
        
    }

}
