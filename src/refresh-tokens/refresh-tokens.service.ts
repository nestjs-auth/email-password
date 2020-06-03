import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Repositories
import { Repository, InsertResult, DeleteResult } from 'typeorm';

// Entities
import { NestJsRefreshTokenEntity } from '../core/entities/refresh-token.entity';

@Injectable()
export class RefreshTokensService {
	public constructor(
		@InjectRepository(NestJsRefreshTokenEntity)
		private refreshTokenRepository: Repository<NestJsRefreshTokenEntity>,
	) {}

	public async createRefreshToken(refreshToken: string, userId: number): Promise<InsertResult> {
		return this.refreshTokenRepository.insert({
			refreshToken,
			userId,
		});
	}

	public async deleteRefreshToken(options: {
		refreshTokenId?: number,
		userId?: number,
	}): Promise<DeleteResult> {
		if (options.refreshTokenId) {
			return this.refreshTokenRepository.delete({
				id: options.refreshTokenId,
			});
		}

		if (options.userId) {
			return this.refreshTokenRepository.delete({
				userId: options.userId,
			});
		}
	}
}
