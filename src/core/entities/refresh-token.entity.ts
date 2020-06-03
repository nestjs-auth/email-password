import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('nestjs-auth_refresh_tokens')
export class NestJsRefreshTokenEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public userId: number;

	@Column()
	public refreshToken: string;
}
