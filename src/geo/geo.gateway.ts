import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: true,
})
export class GeoGateway {

  @WebSocketServer()
  server: Server;

  emitLocation(data: any) {
    this.server.emit('location', data);
  }
}