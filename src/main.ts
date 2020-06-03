import { NestFactory } from '@nestjs/core';

// Modules
import { NestJsAuthEmailPasswordModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(NestJsAuthEmailPasswordModule.forRoot());
  await app.listen(3000);
}
bootstrap();
