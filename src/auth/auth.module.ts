import { DynamicModule, Module } from '@nestjs/common';

// Services
import { AuthService } from './auth.service';

// Modules
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '@users/users.module';
import { JwtModule } from '@nestjs/jwt';

// Strategies
import { BasicStrategy } from './basic.strategy';
import { JwtStrategy } from './jwt.strategy';

// Interfaces
import { AppModuleInstantiationOptions } from '@core/interfaces/config-options.interface';

// Constants
import { jwtSecretConstant } from '@core/constants/constants.constants';

@Module({})
export class AuthModule {
	public static forRoot(options: AppModuleInstantiationOptions = {
		jwtSecret: 'super-secret-jwt-secret',
	}): DynamicModule {
		return {
			module: AuthModule,
			providers: [
				AuthService,
				BasicStrategy,
				JwtStrategy,
				{
					provide: jwtSecretConstant,
					useValue: options.jwtSecret,
				},
			],
			imports: [
				UsersModule,
				PassportModule,
				JwtModule.register({
					secret: options.jwtSecret
				}),
			],
			exports: [AuthService],
		}
	}
}
