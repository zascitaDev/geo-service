import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Microservicio MQTT
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT,
    options: {
      url: `mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`,
      username: process.env.MQTT_USER,
      password: process.env.MQTT_PASSWORD,
      clientId: 'geo-service-' + Math.random().toString(16).slice(2),
    },
  });

  await app.startAllMicroservices();

  await app.listen(3000);
  console.log('🚀 Geo Service HTTP corriendo en puerto 3000');
}

bootstrap();