import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT,
    options: {
      url: `mqtt://${process.env.MQTT_HOST}:1883`,
      username: process.env.MQTT_USER,
      password: process.env.MQTT_PASS,
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}

void bootstrap();