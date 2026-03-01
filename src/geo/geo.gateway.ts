import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GeoGateway {
  @WebSocketServer()
  server: Server;

  emitLocation(data: any) {
    console.log('📡 Enviando ubicación a clientes WebSocket:', data);
    this.server.emit('location', data);
  }
}