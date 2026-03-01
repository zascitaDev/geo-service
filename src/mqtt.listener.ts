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

    console.log('📍 UBICACION RECIBIDA', payload);

    // ⭐ EMITE AL MAPA EN TIEMPO REAL
    this.geoGateway.emitirUbicacion(payload);
  }
}