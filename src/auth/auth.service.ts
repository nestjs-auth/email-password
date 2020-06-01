import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { uuid4 } from 'uuid';

// Services
import { UsersService } from '../users/users.service';

// Interfaces
import { NestAuthUser } from '../users/users.interface';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService
	) { }

	public async validateUser(username: string, password: string): Promise<any> {
		const user = await this.usersService.findOne(username);

		if (user && await bcrypt.compare(password, user.password)) {
			const { password, ...result } = user;
			return result;
		}

		return null;
	}

	async login(user: NestAuthUser) {
		const accessToken = {
			id: user.id,
			username: user.username,
			expires: Date.now() + (30 * 60_000), // Auth Tokens live for 30m
		};

		const refreshToken = {
			id: user.id,
			username: user.username,
			expires: Date.now() + ((60 * 24 * 14) * 60_000), // Refresh tokens live for 14 days
		};

		return {
			accessToken: this.jwtService.sign(accessToken),
			refreshToken: this.jwtService.sign(refreshToken),
		};
	}
}
