import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Services
import { UsersService } from '@users/users.service';

// Modules
import { NestJsAuthEmailPasswordModule } from '@src/app.module';

// Entities
import { NestJsUserEntity } from '@core/entities/user.entity';
import { getConnection } from 'typeorm';

describe('Users E2E', () => {
	let app: INestApplication;

	let usersService: UsersService;

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

		await app.init();

		done();
	});

	afterAll(async () => {
		await app.close();
	});

	describe('findOne', () => {
		fit('Should find user', async done => {
			const username = 'test@test.com';

			try {
				await getConnection()
					.createQueryBuilder()
					.insert()
					.into(NestJsUserEntity)
					.values([
						{
							username,
							password: '$2b$05$NGLMjZ6Mc.RxOyFXKGVah.HO.m4bwUpMWm.NvqQ9jB0LZsVCe2Vli', // "password" hashed, 5 rounds
						},
					])
					.execute();
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
