import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
        enableImplicitConversion: true, //automatically convert primitive types based on DTO type annotation
      },
    }),
  );
  // Enable CORS
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') ?? 'http://localhost:3001', //specifies w/c domains are allowed to access the api
    credentials: true, //allows cookies and authentication headers to be sent in cors request
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], //specifies permited http methods
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'], //specifies headers a frontend can send
  });

  // Enable Swagger documentation
  //configure API metadata on : version,description
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API documentation for the application')
    .setVersion('1.0')
    .addTag('auth', 'Authentication related endpoints') //tags for endpoints
    //bearer for access tokens, to test authenticated endpoints
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    // for refresh tokens
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Refresh-JWT',
        description: 'Enter Refresh JWT token',
        in: 'header',
      },
      '-JWT-refresh',
    )
    .addServer('http://localhost:3001', 'Development server')
    .build(); //builds the doc

  const document = SwaggerModule.createDocument(app, config);
  //set swagger UI endpoint,
  SwaggerModule.setup('api/docs', app, document, {
    //options for UI customization
    swaggerOptions: {
      persistAuthorization: true, //keeps auth tokens after page reload
      tagsSorter: 'alpha', // sorts API tags alphabetically
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'API Documentation', //sets browser tab title
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    //styles swagger UI
    customCss: `.swagger-ui .topbar{display:none;}
    .swagger-ui .info{margin:50px 0;}
    .swagger-ui .info .title{color:#4a90E2;}
     `,
  });
  // Set the port where the server
  const PORT = process.env.PORT ?? 3001;
  await app.listen(PORT);
  console.log(`The server started on the port ${PORT}`);
}
bootstrap().catch((error) => {
  Logger.error('Error starting the application:', error);
  process.exit(1);
});
