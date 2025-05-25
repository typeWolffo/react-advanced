import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { McpService } from './mcp.service';
import { MCPStreamChunk } from '@repo/mcp-types';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5000', 'http://localhost:5001', 'http://localhost:5173'],
    credentials: true,
  },
})
export class McpGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly mcpService: McpService) {}

  handleConnection(client: Socket) {
    console.log(`MCP Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`MCP Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('interpret-message')
  async handleInterpretMessage(
    @MessageBody() data: { message: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const stream = this.mcpService.interpretMessage(data.message);

      for await (const chunk of stream) {
        client.emit('stream-chunk', chunk);
      }

      client.emit('stream-end');
    } catch (error) {
      const errorChunk: MCPStreamChunk = {
        type: 'error',
        content: `Error: ${(error as Error).message}`,
      };
      client.emit('stream-chunk', errorChunk);
      client.emit('stream-end');
    }
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.room);
    client.emit('joined-room', { room: data.room });
  }

  emitToRoom(room: string, event: string, data: any) {
    this.server.to(room).emit(event, data);
  }
}
