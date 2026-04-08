import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix for all routes
  app.setGlobalPrefix('api/v1');

  // Set Global data validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove any property Not defined in the DTO and prevent extra data from being processed
      forbidNonWhitelisted: true, //throws an error if the request contains unexpected properties enforcing strict DTO validation
      transform: true, //convert plain request objects into DTO class instances,allowing you to use class methods or decorators
      transformOptions: {
        enableImplicitConversion: true, //automatically convert primitive types based DTO type annotation
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((error) => {
  Logger.error('Error starting the application:', error);
  process.exit(1);
});
