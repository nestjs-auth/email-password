import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

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
		const payload = {
			id: user.id,
			username: user.username,
		};

		return {
			access_token: this.jwtService.sign(payload),
		};
	}
}
