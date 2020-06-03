import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Services
import { RefreshTokensService } from './refresh-tokens.service';

// Entities
import { NestJsRefreshTokenEntity } from '../core/entities/refresh-token.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			NestJsRefreshTokenEntity,
		]),
	],
	providers: [
		RefreshTokensService,
	],
	exports: [
		RefreshTokensService,
	],
})
export class RefreshTokensModule {}
