import { Module } from '@nestjs/common';
import { GeoService } from './geo.service';
import { GeoGateway } from './geo.gateway';

@Module({
  providers: [GeoService, GeoGateway],
})
export class GeoModule {}