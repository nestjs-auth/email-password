import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		@Inject('nestjs-jwt-auth_jwt-secret')
		private jwtSecret: string,

	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: jwtSecret,
		});
	}

	async validate(payload: any) {
		return { userId: payload.sub, username: payload.username };
	}
}
