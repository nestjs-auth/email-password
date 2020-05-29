import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Utils
import { startTestingDatabase, stopDockerContainer } from '@test/testing.utils';

// Services
import { UsersService } from '@users/users.service';

// Modules
import { AppModule } from '@src/app.module';

// Entities
import { NestAuthUserEntity } from '@core/entities/user.entity';
import { getConnection } from 'typeorm';

jest.setTimeout(25000);

describe('Users E2E', () => {
	let app: INestApplication;
	let container: { containerId: string, databasePort: number };

	let usersService: UsersService;

	beforeAll(async done => {
		try {
			container = await startTestingDatabase();
		} catch (e) {
			console.log(e);
			return;
		}

		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				AppModule.forRoot(),
				TypeOrmModule.forRoot({
					type: 'mysql',
					host: 'localhost',
					port: container.databasePort,
					username: 'root',
					password: 'example',
					database: 'test',
					entities: [
						NestAuthUserEntity,
					],
				}),
			],
		}).compile();

		app = moduleFixture.createNestApplication();

		usersService = await app.get(UsersService);

		await app.init();

		done();
	});

	afterAll(async () => {
		try {
			await stopDockerContainer(container.containerId);
		} catch (e) {
			console.log(e);
		}

		await app.close();
	});

	describe('findOne', () => {
		fit('Should find user', async done => {
			const username = 'test@test.com';

			try {
				await getConnection()
					.createQueryBuilder()
					.insert()
					.into(NestAuthUserEntity)
					.values([
						{
							username,
							password: '$2b$05$NGLMjZ6Mc.RxOyFXKGVah.HO.m4bwUpMWm.NvqQ9jB0LZsVCe2Vli', // "password" hashed, 5 rounds
						},
					])
					.execute();
			} catch (e) {
				console.log(e);
				return;
			}

			try {
				const user = await usersService.findOne(username);

				expect(user).toBeDefined();

				done();
			} catch (e) {
				console.log(e);
			}
		});
	});
});
