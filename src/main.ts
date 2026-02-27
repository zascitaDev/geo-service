import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT,
    options: {
      url: `mqtt://mosquitto:1883`, // o tcp://mosquitto:1883
      username: process.env.MQTT_USER,
      password: process.env.MQTT_PASSWORD,
      clientId: 'geo-service-' + Math.random().toString(16).substr(2, 8),
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}

void bootstrap();