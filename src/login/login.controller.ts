import { Controller, Request, Post, UseGuards, Headers, HttpCode, Get, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

// Interfaces
import { NestAuthUser } from '../users/users.interface';

// Services
import { AuthService } from '../auth/auth.service';


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
		@Headers('Authorization') auth: string,
		@Request() req: RequestWithUser,
		@Res() res: Response,
	) {
		const tokens = await this.authService.login(req.user);

		res.cookie('refreshToken', tokens.refreshToken, {
			httpOnly: true,
			expires: new Date(Date.now() + 1_209_600_000), // 14 days
		})

		res.send({
			accessToken: tokens.accessToken,
			refresh: new Date(Date.now() + 900_000).getTime(),
		});
	}
}
