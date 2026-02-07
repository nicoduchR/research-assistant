import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import type { ProgressEvent, CompleteEvent, ErrorEvent } from '@repo/types';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class ProcessingGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ProcessingGateway.name);

  constructor(private jwtService: JwtService) {}

  afterInit() {
    this.logger.log('WebSocket gateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      // Extract JWT from handshake cookies
      const cookies = client.handshake.headers.cookie;
      if (!cookies) {
        this.logger.warn(`Client ${client.id} rejected: no cookies`);
        client.disconnect();
        return;
      }

      // Parse access_token from cookie string
      const tokenMatch = cookies.match(/access_token=([^;]+)/);
      if (!tokenMatch) {
        this.logger.warn(
          `Client ${client.id} rejected: no access_token cookie`,
        );
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(tokenMatch[1]);
      const userId = payload.sub;

      if (!userId) {
        this.logger.warn(
          `Client ${client.id} rejected: invalid token payload`,
        );
        client.disconnect();
        return;
      }

      // Store userId on socket for later reference
      client.data.userId = userId;

      // Join user-scoped room
      await client.join(`user:${userId}`);

      this.logger.log(`Client ${client.id} connected as user ${userId}`);
    } catch (error) {
      this.logger.warn(
        `Client ${client.id} rejected: ${error instanceof Error ? error.message : 'auth failed'}`,
      );
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(
      `Client ${client.id} disconnected (user: ${client.data.userId || 'unknown'})`,
    );
  }

  emitProgress(
    userId: string,
    payload: Omit<ProgressEvent, 'timestamp'>,
  ): void {
    this.server.to(`user:${userId}`).emit('processing:progress', {
      ...payload,
      timestamp: new Date().toISOString(),
    });
  }

  emitComplete(
    userId: string,
    payload: Omit<CompleteEvent, 'timestamp'>,
  ): void {
    this.server.to(`user:${userId}`).emit('processing:complete', {
      ...payload,
      timestamp: new Date().toISOString(),
    });
  }

  emitError(
    userId: string,
    payload: Omit<ErrorEvent, 'timestamp'>,
  ): void {
    this.server.to(`user:${userId}`).emit('processing:error', {
      ...payload,
      timestamp: new Date().toISOString(),
    });
  }
}
