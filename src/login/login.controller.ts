import { Controller, Request, Response, Post, UseGuards, Headers, HttpCode, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { Cookies } from '@nestjsplus/cookies';

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
	@HttpCode(200)
	async login(
		@Headers('authorization') auth: string,
		@Request() req: RequestWithUser,
		@Response() res: Response,
		// @Cookies() cookies: any,
	) {
		// const tokens = await this.authService.login(req.user);

		//const cookies = res.headers.get('cookies');

		return await this.authService.login(req.user);
	}

	@Get('test')
	async test(
		@Cookies() cookies,
	) {
		console.log(cookies);
		return;
	}
}
