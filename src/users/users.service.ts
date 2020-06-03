import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';

// Entities
import { NestJsUserEntity } from '../core/entities/user.entity';

@Injectable()
export class UsersService {
	public constructor(
		@InjectRepository(NestJsUserEntity)
		private usersRepository: Repository<NestJsUserEntity>,
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
