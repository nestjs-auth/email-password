import { Module } from '@nestjs/common';

// Controllers
import { LoginController } from './login.controller';

// Modules
import { AuthModule } from '@auth/auth.module';

// Service
import { LoginService } from './login.service';

@Module({
	imports: [
		AuthModule.forRoot(),
	],
	controllers: [LoginController],
	providers: [LoginService]
})
export class LoginModule {}
