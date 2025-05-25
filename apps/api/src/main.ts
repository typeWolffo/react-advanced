import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import { configureNestJsTypebox } from 'nestjs-typebox';

import { AppModule } from "./app.module";
import { exportSchemaToFile } from "./utils/save-swagger-to-file";
import { setupValidation } from "./utils/setup-validation";

configureNestJsTypebox({
  patchSwagger: true,
  setFormats: true,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });
  console.log(process.env.CORS_ORIGIN);
  setupValidation();

  app.use(cookieParser());
  app.setGlobalPrefix("api");
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(','),
    // origin: '*',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle("API Documentation")
    .setDescription("API documentation with TypeBox")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document, {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
      tryItOutEnabled: true,
    },
  });
  exportSchemaToFile(document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
