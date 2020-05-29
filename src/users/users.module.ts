import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Services
import { UsersService } from './users.service';

// Entities
import { NestAuthUserEntity } from '@core/entities/user.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			NestAuthUserEntity,
		]),
	],
	providers: [
		UsersService,
	],
	exports: [
		UsersService,
	],
})
export class UsersModule { }
