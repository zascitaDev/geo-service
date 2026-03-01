import { Controller } from '@nestjs/common';
import { EventPattern, Payload, Ctx, MqttContext } from '@nestjs/microservices';

@Controller()
export class MqttListener {

  @EventPattern('usuarios/+/ubicacion')
  handleLocation(
    @Payload() data: any,
    @Ctx() context: MqttContext,
  ) {

    const topic = context.getTopic();

    // obtener userId del topic
    const parts = topic.split('/');
    const userId = parts[1];

    console.log('======================');
    console.log('📍 UBICACION RECIBIDA');
    console.log('Usuario:', userId);
    console.log('Lat:', data.lat);
    console.log('Lng:', data.lng);
    console.log('======================');

    // aquí después guardarás en DB
  }
}