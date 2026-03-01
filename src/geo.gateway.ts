import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GeoGateway implements OnGatewayConnection {

  @WebSocketServer()
  server: Server;

  handleConnection(client: any) {
    console.log('🟢 Cliente conectado al realtime map');
  }

  emitirUbicacion(data: any) {
    this.server.emit('ubicacion', data);
  }
}