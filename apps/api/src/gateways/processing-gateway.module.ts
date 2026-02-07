import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ProcessingGateway } from './processing.gateway';

@Module({
  imports: [AuthModule],
  providers: [ProcessingGateway],
  exports: [ProcessingGateway],
})
export class ProcessingGatewayModule {}
