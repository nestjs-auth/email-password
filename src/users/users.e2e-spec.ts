import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';

// Services
import { UsersService } from './users.service';

// Modules
import { NestJsAuthEmailPasswordModule } from '../app.module';

// Entities
import { NestJsUserEntity } from '../core/entities/user.entity';
import { Repository } from 'typeorm';

describe('Users E2E', () => {
	let app: INestApplication;

	// Services
	let usersService: UsersService;

	// Repositories
	let userRepository: Repository<NestJsUserEntity>;

	beforeAll(async done => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				NestJsAuthEmailPasswordModule.forRoot(),
				TypeOrmModule.forRoot({
					type: 'sqlite',
					database: 'memory',
					entities: [
						NestJsUserEntity,
					],
					synchronize: true,
				}),
			],
		}).compile();

		app = moduleFixture.createNestApplication();

		usersService = await app.get(UsersService);

		userRepository = await app.get(getRepositoryToken(NestJsUserEntity));

		await app.init();

		done();
	});

	afterAll(async () => {
		await app.close();
	});

	describe('findOne', () => {
		it('Should find user', async done => {
			const username = 'test@test.com';

			try {
				await userRepository
					.insert({
						username,
						password: '$2b$05$NGLMjZ6Mc.RxOyFXKGVah.HO.m4bwUpMWm.NvqQ9jB0LZsVCe2Vli', // "password" hashed, 5 rounds
					});
			} catch (e) {
				console.log(e);
				done(false);
				return;
			}

			try {
				const user = await usersService.findOne(username);

				expect(user).toBeDefined();

				done();
			} catch (e) {
				done(false);
				console.log(e);
			}
		});
	});
});
