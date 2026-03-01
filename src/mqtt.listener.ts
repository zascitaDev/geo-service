import { Controller } from '@nestjs/common';
import { EventPattern, Payload, Ctx, MqttContext } from '@nestjs/microservices';

@Controller()
export class MqttListener {

  @EventPattern('#') // escucha TODO
  handleAll(
    @Payload() data: any,
    @Ctx() context: MqttContext,
  ) {

    const topic = context.getTopic();

    console.log('======================');
    console.log('📥 MQTT RECIBIDO');
    console.log('Topic:', topic);
    console.log('Data:', data);
    console.log('======================');
  }
}