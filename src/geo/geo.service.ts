import { Injectable } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { GeoGateway } from './geo.gateway';

@Injectable()
export class GeoService {
  constructor(private readonly geoGateway: GeoGateway) {}

  @EventPattern('usuarios/+/ubicacion')
  handleLocationUpdate(@Payload() data: any) {
    console.log('Ubicación recibida:', data);

    // Emitir al WebSocket
    this.geoGateway.emitLocation(data);
  }
}