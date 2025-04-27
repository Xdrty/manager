import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { readFileSync } from 'fs';

async function bootstrap() {
  const httpsOptions = {
    key:  readFileSync('/etc/letsencrypt/live/schoool-manager.duckdns.org/privkey.pem'),
    cert: readFileSync('/etc/letsencrypt/live/schoool-manager.duckdns.org/fullchain.pem'),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });
  app.use(cookieParser());

  app.enableCors({
    origin: 'https://school-manager-pi.vercel.app/',
    credentials: true,
    allowedHeaders: ['Content-Type','Authorization','Accept','X-Requested-With'],
    methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
    exposedHeaders: ['Set-Cookie'],
  });

  const config = new DocumentBuilder()
    .setTitle('Lessons API')
    .setDescription('API для управления уроками')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  console.log('Server starting on port 443 with TLS');
  await app.listen(443, '0.0.0.0');
}

bootstrap();
