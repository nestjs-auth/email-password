import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class NestAuthUserEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public username: string;

	@Column()
	public password: string;
}
