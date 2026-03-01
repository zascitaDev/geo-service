import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MqttListener } from './mqtt.listener';

@Module({
  controllers: [
    AppController,
    MqttListener, // ⭐ ESTE FALTABA
  ],
  providers: [AppService],
})
export class AppModule {}