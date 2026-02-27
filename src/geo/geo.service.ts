import { Injectable } from '@nestjs/common';
import { EventPattern, Payload, Ctx, MqttContext } from '@nestjs/microservices';
import { GeoGateway } from './geo.gateway';

@Injectable()
export class GeoService {
  constructor(private readonly geoGateway: GeoGateway) {}

  @EventPattern('usuarios/#')
  handleLocationUpdate(
    @Payload() data: any,
    @Ctx() context: MqttContext,
  ) {
    const topic = context.getTopic();

    console.log('📥 Topic:', topic);
    console.log('📍 Ubicación recibida:', data);

    // Solo procesamos si termina en /ubicacion
    if (topic.endsWith('/ubicacion')) {
      this.geoGateway.emitLocation(data);
    }
  }
}