import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('nestjs-auth_refresh_tokens', {
	synchronize: true,
})
export class NestJsRefreshTokenEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public username: string;

	@Column()
	public token: string;
}
