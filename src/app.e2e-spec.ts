import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Injectable } from '@nestjs/common';
import { TypeOrmModule, InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, getConnection, Repository } from 'typeorm';

// Services
import { UsersService } from './users/users.service';

// Modules
import { NestJsAuthEmailPasswordModule } from './src/app.module';

// Entities
import { NestJsUserEntity } from './core/entities/user.entity';

// Mock Services
@Injectable()
class MockTestTypeOrmConnectionService {
	public constructor(
		@InjectConnection('default')
		public readonly defaultConnection: Connection,

		@InjectRepository(NestJsUserEntity)
		public readonly usersRepository: Repository<NestJsUserEntity>
	) {}

	public get getDefaultConnection(): Connection {
		return getConnection();
	}
}

describe('App E2E', () => {
	let app: INestApplication;

	let mockTestTypeOrmConnectionService: MockTestTypeOrmConnectionService;
	let usersService: UsersService;

	beforeAll(async done => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			providers: [
				MockTestTypeOrmConnectionService,
			],
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
				TypeOrmModule.forFeature([
					NestJsUserEntity,
				]),
			],
		}).compile();

		app = moduleFixture.createNestApplication();

		mockTestTypeOrmConnectionService = await app.get(MockTestTypeOrmConnectionService);
		usersService = await app.get(UsersService);

		await app.init();
		done();
	});

	afterAll(async () => {
		await app.close();
	});

	describe('init', () => {
		it('App should be defined', () => {
			expect(app).toBeDefined();
		});
	});

	describe('mockTestTypeOrmConnectionService', () => {
		it('defaultConnection should be defined', () => {
			expect(mockTestTypeOrmConnectionService.defaultConnection).toBeDefined();
			expect(mockTestTypeOrmConnectionService.defaultConnection?.isConnected).toBeDefined();
		});

		it('usersRepository should be defined', () => {
			expect(mockTestTypeOrmConnectionService.usersRepository).toBeDefined();
		});

		it('getDefaultConnection should return the default connection', () => {
			expect(mockTestTypeOrmConnectionService.getDefaultConnection).toBeDefined();
			expect(mockTestTypeOrmConnectionService.getDefaultConnection?.isConnected).toBeDefined();
		});
	});
});
