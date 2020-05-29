import { Controller, Request, Post, UseGuards, Get, Headers } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';

// Interfaces
import { NestAuthUser } from '../users/users.interface';

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
	async login(
		@Headers('authorization') auth: string,
		@Request() req: RequestWithUser,
	) {
		return this.authService.login(req.user);
	}
}
