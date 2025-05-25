import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  app.enableCors({
    origin: [
      'http://localhost:5000',
      'http://localhost:5001',
      'http://localhost:5173',
      'https://advanced.localhost',
      'http://advanced.localhost'
    ],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('MCP Server API')
    .setDescription('Model Context Protocol Server for AI-powered task management')
    .setVersion('1.0')
    .addTag('mcp')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.MCP_PORT || 3002;
  await app.listen(port);

  console.log(`🚀 MCP Server running on http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
