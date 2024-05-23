import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  //swagger
  const options = new DocumentBuilder().setTitle('kunsong-api-document').setDescription('nestjsDemo-userApi-document').setVersion('v1').build();
  const document = SwaggerModule.createDocument(app,options);
  SwaggerModule.setup('/api-docs',app,document)

  await app.listen(3001);
}
bootstrap();
