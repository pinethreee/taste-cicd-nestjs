import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { WinstonModule } from 'nest-winston';

import { AppModule } from '@app/app.module';
import { createWinstonConfig } from '@app/config/winston.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useLogger(
    WinstonModule.createLogger(
      createWinstonConfig(
        configService.get<string>('PROJECT_NAME') ?? 'a.biz',
        configService.get<string>('NODE_ENV') ?? 'dev',
      ),
    ),
  );

  const config = new DocumentBuilder()
    .setTitle(process.env.PROJECT_TITLE!)
    .setDescription(process.env.PROJECT_DESCRIPTION!)
    .setVersion('1.0')
    .addBearerAuth()
    .addBasicAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err: Error) => {
  const logger = new Logger('Bootstrap');
  logger.error('Application failed to start', err);
  process.exit(1);
});
