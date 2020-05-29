import { Controller, Request, Post, UseGuards, Headers, HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';

// Interfaces
import { NestAuthUser } from '../users/users.interface';
import { Code } from 'typeorm';

interface RequestWithUser extends Request {
	user: NestAuthUser
}

@Controller()
export class LoginController {
	constructor(
		private readonly authService: AuthService,
	) { }

	@UseGuards(AuthGuard('basic'))
	@Post('auth/login')
	@HttpCode(200)
	async login(
		@Headers('authorization') auth: string,
		@Request() req: RequestWithUser,
	) {
		return this.authService.login(req.user);
	}
}
