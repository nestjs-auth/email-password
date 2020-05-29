import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';

// Entities
import { NestAuthUserEntity } from '@core/entities/user.entity';

@Injectable()
export class UsersService {
	public constructor(
		@InjectRepository(NestAuthUserEntity)
		private usersRepository: Repository<NestAuthUserEntity>,
	) {}

	public async findOne(username: string): Promise<any | undefined> {
		try {
			return await this.usersRepository
				.findOne({username});
		} catch (e) {
			throw new Error(e);
		}
	}
}
