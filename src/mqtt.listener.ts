import { Controller } from '@nestjs/common';
import { EventPattern, Payload, Ctx, MqttContext } from '@nestjs/microservices';
import { GeoGateway } from './geo.gateway';

@Controller()
export class MqttListener {
  private usuarios = new Map<
    string,
    {
      lastHeartbeat: number;
      conectadoEn?: number;
      online: boolean;
    }
  >();

  constructor(private geoGateway: GeoGateway) {
    this.iniciarMonitorPresencia();
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

    console.log('📍 UBICACION:', payload);

    this.geoGateway.server.emit('ubicacion', payload);
  }

  // ================================
  // STATUS INICIAL
  // ================================
  @EventPattern('usuarios/+/status')
  handleStatus(@Payload() data: any, @Ctx() context: MqttContext) {
    const topic = context.getTopic();
    const userId = topic.split('/')[1];

    console.log('🟢 STATUS ONLINE:', userId);

    this.usuarios.set(userId, {
      lastHeartbeat: Date.now(),
      conectadoEn: data.timestamp || Date.now(),
      online: true,
    });

    this.geoGateway.server.emit('status', {
      usuario: userId,
      status: 'online',
      conectadoEn: data.timestamp,
    });
  }

  // ================================
  // HEARTBEAT
  // ================================
  @EventPattern('usuarios/+/heartbeat')
  handleHeartbeat(@Payload() data: any, @Ctx() context: MqttContext) {
    const topic = context.getTopic();
    const userId = topic.split('/')[1];

    const user = this.usuarios.get(userId);

    if (!user) {
      // reconexión automática
      this.usuarios.set(userId, {
        lastHeartbeat: Date.now(),
        conectadoEn: Date.now(),
        online: true,
      });

      this.geoGateway.server.emit('status', {
        usuario: userId,
        status: 'online',
        conectadoEn: Date.now(),
      });

      return;
    }

    user.lastHeartbeat = Date.now();
    user.online = true;
  }

  // ================================
  // MONITOR DE PRESENCIA
  // ================================
  private iniciarMonitorPresencia() {
    setInterval(() => {
      const ahora = Date.now();

      this.usuarios.forEach((data, userId) => {
        const diff = ahora - data.lastHeartbeat;

        // 20 segundos sin heartbeat
        if (diff > 20000 && data.online) {
          console.log('🔴 OFFLINE:', userId);

          data.online = false;

          this.geoGateway.server.emit('status', {
            usuario: userId,
            status: 'offline',
            lastSeen: data.lastHeartbeat,
          });
        }
      });
    }, 5000);
  }
}
