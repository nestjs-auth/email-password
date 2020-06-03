import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { uuid4 } from 'uuid';

// Services
import { UsersService } from '../users/users.service';
import { RefreshTokensService } from '../refresh-tokens/refresh-tokens.service';

// Interfaces
import { NestAuthUser } from '../users/users.interface';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
		private readonly refreshTokensService: RefreshTokensService,
	) {}

	public async validateUser(username: string, password: string): Promise<any> {
		const user = await this.usersService.findOne(username);

		if (user && await bcrypt.compare(password, user.password)) {
			const { password, ...result } = user;
			return result;
		}

		return null;
	}

	public async login(user: NestAuthUser): Promise<{
		accessToken: string,
		refreshToken: string,
	}> {
		const accessToken = this.jwtService.sign({
			id: user.id,
			username: user.username,
			expires: Date.now() + 900_00, // Auth Tokens live for 15m
		});

		const refreshToken = this.jwtService.sign({
			id: user.id,
			username: user.username,
			expires: new Date(Date.now() + 1_209_600_000), // Refresh tokens live for 14 days
		});

		await this.refreshTokensService.deleteRefreshToken({
			userId: user.id,
		});

		await this.refreshTokensService.createRefreshToken(refreshToken, user.id);

		return {
			accessToken,
			refreshToken,
		};
	}
}
