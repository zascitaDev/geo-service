import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT,
    options: {
      url: `mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`,

      username: process.env.MQTT_USER,
      password: process.env.MQTT_PASSWORD,

      clean: false,              // ⭐ IMPORTANTE
      reconnectPeriod: 5000,
      connectTimeout: 4000,
      keepalive: 60,

      resubscribe: true,         // ⭐ CLAVE
      queueQoSZero: true,        // ⭐ evita cortes

      clientId:
        'geo-service-' +
        Math.random().toString(16).substring(2, 10),
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);

  console.log('🚀 Geo Service HTTP corriendo en 3000');
}

bootstrap();