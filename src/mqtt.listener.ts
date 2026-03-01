import { Controller } from '@nestjs/common';
import {
  EventPattern,
  Payload,
  Ctx,
  MqttContext,
} from '@nestjs/microservices';

import { GeoGateway } from './geo.gateway';

@Controller()
export class MqttListener {

  constructor(private geoGateway: GeoGateway) {}

  @EventPattern('usuarios/+/ubicacion')
  handleLocation(
    @Payload() data: any,
    @Ctx() context: MqttContext,
  ) {

    const topic = context.getTopic();
    const userId = topic.split('/')[1];

    const payload = {
      usuario: userId,
      lat: data.lat,
      lng: data.lng,
    };

    console.log('📍 UBICACION RECIBIDA:', payload);

    // enviar al websocket
    this.geoGateway.emitirUbicacion(payload);
  }
}