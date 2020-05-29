import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Injectable } from '@nestjs/common';
import { TypeOrmModule, InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, getConnection, Repository } from 'typeorm';

// Utils
import { startTestingDatabase, stopDockerContainer } from '@test/testing.utils';

// Services
import { UsersService } from '@users/users.service';

// Modules
import { AppModule } from '@src/app.module';

// Entities
import { NestAuthUserEntity } from '@core/entities/user.entity';

// Mock Services
@Injectable()
class MockTestTypeOrmConnectionService {
	public constructor(
		@InjectConnection('default')
		public readonly defaultConnection: Connection,

		@InjectRepository(NestAuthUserEntity)
		public readonly usersRepository: Repository<NestAuthUserEntity>
	) {}

	public getDefaultConnection(): Connection {
		return getConnection();
	}
}

jest.setTimeout(25000);

describe('App E2E', () => {
	let app: INestApplication;
	let container: { containerId: string, databasePort: number };

	let mockTestTypeOrmConnectionService: MockTestTypeOrmConnectionService;
	let usersService: UsersService;

	beforeAll(async done => {
		try {
			container = await startTestingDatabase();
		} catch (e) {
			console.log(e);
			return;
		}

		const moduleFixture: TestingModule = await Test.createTestingModule({
			providers: [
				MockTestTypeOrmConnectionService,
			],
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
				TypeOrmModule.forFeature([
					NestAuthUserEntity,
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
		try {
			await stopDockerContainer(container.containerId);
		} catch (e) {
			console.log(e);
		}

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
	});
});
