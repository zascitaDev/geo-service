import { Injectable } from '@nestjs/common';
import { EventPattern, Payload, Ctx, MqttContext } from '@nestjs/microservices';
import { GeoGateway } from './geo.gateway';

@Injectable()
export class GeoService {
  constructor(private readonly geoGateway: GeoGateway) {}

  /**
   * ✅ IMPORTANTE:
   * NestJS NO soporta usuarios/# correctamente
   * usamos wildcard MQTT real:
   *
   * usuarios/+/ubicacion
   */
  @EventPattern('usuarios/+/ubicacion')
  handleLocationUpdate(
    @Payload() data: any,
    @Ctx() context: MqttContext,
  ) {
    const topic = context.getTopic();

    try {
      // ✅ MQTT llega como Buffer → convertir a JSON
      const payload =
        typeof data === 'string'
          ? JSON.parse(data)
          : JSON.parse(data.toString());

      console.log('📥 Topic recibido:', topic);
      console.log('📍 Ubicación recibida:', payload);

      // ✅ enviar a WebSocket
      this.geoGateway.emitLocation(payload);

    } catch (error) {
      console.error('❌ Error parseando payload MQTT:', error);
    }
  }
}