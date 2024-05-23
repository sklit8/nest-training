import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";


async function bootstrap() {
  const app = await NestFactory.create(UserModule);

  const options = new DocumentBuilder().setTitle('kunsong-api-document').setDescription('nestjsDemo-userApi-document').setVersion('v1').build()
  const document = SwaggerModule.createDocument(app,options)
  SwaggerModule.setup('/api-docs',app,document)
  
  await app.listen(3000);
}
bootstrap();
