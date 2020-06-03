import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LoginModule } from './login/login.module';
import { RefreshTokensModule } from './refresh-tokens/refresh-tokens.module';

// Interfaces
import { AppModuleInstantiationOptions } from './core/interfaces/config-options.interface';

// Entities
import { NestJsUserEntity } from './core/entities/user.entity';
import { NestJsRefreshTokenEntity } from './core/entities/refresh-token.entity';

@Module({})
export class OptionalImportsModule {
	public static forRoot(): DynamicModule {
		const optionalImports = []

		if (process.env.NODE_ENV === 'nestjs-auth-ep_development') {
			optionalImports.push(TypeOrmModule.forRoot({
				type: 'mysql',
				host: 'localhost',
				port: 3306,
				username: 'root',
				password: 'example',
				database: 'test',
				entities: [
					NestJsUserEntity,
					NestJsRefreshTokenEntity,
				],
				synchronize: true,
			}));
		}

		return {
			module: OptionalImportsModule,
			imports: [
				...optionalImports,
			],
			exports: [
				...optionalImports,
			],
		}
	}
}

@Module({})
export class NestJsAuthEmailPasswordModule {
	public static forRoot(options: AppModuleInstantiationOptions = {
		jwtSecret: 'super-secret-jwt-secret',
	}): DynamicModule {
		return {
			module: NestJsAuthEmailPasswordModule,
			imports: [
				AuthModule.forRoot(options),
				UsersModule,
				LoginModule,
				OptionalImportsModule.forRoot(),
				RefreshTokensModule,
			],
		}
	}
}
