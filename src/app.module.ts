import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MqttListener } from './mqtt.listener';
import { GeoGateway } from './geo.gateway';

@Module({
  controllers: [AppController, MqttListener],
  providers: [AppService, GeoGateway],
})
export class AppModule {}
