import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT,
    options: {
      url: `mqtts://${process.env.MQTT_HOST}:${process.env.MQTT_PORT_TLS}`,
      username: process.env.MQTT_USER,
      password: process.env.MQTT_PASS,
      ca: fs.readFileSync('./mosquitto/certs/mosquitto.crt'),
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}

void bootstrap();