import { Controller } from '@nestjs/common';
import { EventPattern, Payload, Ctx, MqttContext } from '@nestjs/microservices';
import { GeoGateway } from './geo.gateway';

@Controller()
export class MqttListener {
  private usuariosActivos = new Map<string, number>();

  constructor(private geoGateway: GeoGateway) {
    this.iniciarMonitorInactividad();
  }

  // ================================
  // UBICACION
  // ================================
  @EventPattern('usuarios/+/ubicacion')
  handleLocation(@Payload() data: any, @Ctx() context: MqttContext) {
    const topic = context.getTopic();
    const userId = topic.split('/')[1];

    const payload = {
      usuario: userId,
      lat: data.lat,
      lng: data.lng,
      timestamp: data.timestamp || Date.now(),
    };

    console.log('📍 UBICACION RECIBIDA:', payload);

    // Guardar último ping
    this.usuariosActivos.set(userId, Date.now());

    // Emitir al websocket
    this.geoGateway.server.emit('ubicacion', payload);
  }

  // ================================
  // STATUS ONLINE
  // ================================
  @EventPattern('usuarios/+/status')
  handleStatus(@Payload() data: any, @Ctx() context: MqttContext) {
    const topic = context.getTopic();
    const userId = topic.split('/')[1];

    const payload = {
      usuario: userId,
      status: data.status,
      conectadoEn: data.timestamp || Date.now(),
    };

    console.log('🟢 STATUS:', payload);

    // Marcar activo
    this.usuariosActivos.set(userId, Date.now());

    this.geoGateway.server.emit('status', payload);
  }

  // ================================
  // DETECTOR DE INACTIVOS
  // ================================
  private iniciarMonitorInactividad() {
    setInterval(() => {
      const ahora = Date.now();

      this.usuariosActivos.forEach((lastSeen, userId) => {
        const diff = ahora - lastSeen;

        // 15 segundos sin enviar ubicación = offline
        if (diff > 15000) {
          console.log('🔴 Usuario inactivo:', userId);

          this.geoGateway.server.emit('status', {
            usuario: userId,
            status: 'offline',
            lastSeen: lastSeen,
          });

          this.usuariosActivos.delete(userId);
        }
      });
    }, 5000);
  }
}
