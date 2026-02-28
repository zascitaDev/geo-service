import { Injectable } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Injectable()
export class GeoService {
  @MessagePattern('usuarios/+/ubicacion')
  handleUbicacion(@Payload() data: any) {
    console.log('📍 Ubicación recibida:', data);
  }
}