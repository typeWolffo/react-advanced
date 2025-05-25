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
import { Task } from '../database/schema';

@WebSocketGateway({
  namespace: '/tasks',
  cors: {
    origin: ['http://localhost:5000', 'http://localhost:5001', 'https://advanced.localhost'],
    credentials: true,
  },
})
export class TasksGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-user-room')
  handleJoinUserRoom(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`user:${data.userId}`);
    client.emit('joined-room', { room: `user:${data.userId}` });
  }

  emitTaskCreated(userId: string, task: Task) {
    this.server.to(`user:${userId}`).emit('task-created', task);
  }

  emitTaskUpdated(userId: string, task: Task) {
    this.server.to(`user:${userId}`).emit('task-updated', task);
  }

  emitTaskDeleted(userId: string, taskId: string) {
    this.server.to(`user:${userId}`).emit('task-deleted', { id: taskId });
  }
}
