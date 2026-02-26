import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT,
    options: {
      url: 'mqtt://api-dev.zascita.com:1883',
      username: 'repartidorUser',
      password: 'Zacita123.',
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}

void bootstrap();