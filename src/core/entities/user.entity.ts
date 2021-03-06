import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('nestjs-auth_users', {
	synchronize: true,
})
export class NestJsUserEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public username: string;

	@Column()
	public password: string;
}
