import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';

// Services
import { UsersService } from '../users/users.service';

// Modules
import { NestJsAuthEmailPasswordModule } from '../app.module';

// Entities
import { NestJsUserEntity } from '../core/entities/user.entity';
import { Repository } from 'typeorm';
import { AssertionError } from 'assert';

describe('Login E2E', () => {
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

	describe('Endpoint /login/auth', () => {
		describe('GET', () => {
			it('Should return a 404', () => {
				return request(app.getHttpServer())
					.get('/auth/login')
					.expect(404);
			});
		});

		describe('POST', () => {
			it('Should return a 401 if not sent a username', () => {
				return request(app.getHttpServer())
					.post('/auth/login')
					.auth(null, 'test')
					.expect(401);
			});

			it('Should return a 401 if not sent a password', () => {
				return request(app.getHttpServer())
					.post('/auth/login')
					.auth('test@test.com', null)
					.expect(401);
			});

			it('Should return an access token if logged in correctly', async () => {
				const username = 'test@test.com';

				await userRepository
					.insert({
						username,
						password: '$2b$05$NGLMjZ6Mc.RxOyFXKGVah.HO.m4bwUpMWm.NvqQ9jB0LZsVCe2Vli', // "password" hashed, 5 rounds
					});

				return request(app.getHttpServer())
					.post('/auth/login')
					.auth(username, 'password')
					.expect(200)
					.then(response => {
						expect(response.body.accessToken).toBeDefined();
					});
			});
		});
	});
});
