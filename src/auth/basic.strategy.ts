import { BasicStrategy as Strategy } from 'passport-http';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';

// Services
import { AuthService } from './auth.service';

// Interfaces
import { NestAuthUser } from '../users/users.interface';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly authService: AuthService,
	) {
		super();
	}

	public async validate(username: string, password: string): Promise<NestAuthUser> {
		if (!username || !password) {
			throw new UnprocessableEntityException();
		}

		const user = await this.authService.validateUser(username, password);

		if (!user) {
			throw new UnauthorizedException();
		}

		return user;
	}
}
