import { io, Socket } from 'socket.io-client';
import {
  MCPToolSchema,
  MCPToolCall,
  MCPToolResponse,
  MCPMessage,
  MCPStreamChunk,
  TaskDTO,
} from '@repo/mcp-types';

export class MCPClient {
  private socket: Socket | null = null;
  private baseUrl: string;
  private wsUrl: string;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(baseUrl: string = 'http://localhost:3002') {
    this.baseUrl = baseUrl;
    this.wsUrl = baseUrl.replace('http', 'ws');
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = io(this.wsUrl, {
        transports: ['websocket'],
        autoConnect: true,
      });

      this.socket.on('connect', () => {
        console.log('Connected to MCP server');
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        reject(error);
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from MCP server');
        this.emit('disconnect');
      });

      this.socket.on('task-update', (data: TaskDTO) => {
        this.emit('task-update', data);
      });

      this.socket.on('stream-chunk', (chunk: MCPStreamChunk) => {
        this.emit('stream-chunk', chunk);
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  async getAvailableTools(): Promise<MCPToolSchema[]> {
    const response = await fetch(`${this.baseUrl}/api/mcp/tools`);
    if (!response.ok) {
      throw new Error(`Failed to get tools: ${response.statusText}`);
    }
    return response.json();
  }

  async callTool(toolCall: MCPToolCall): Promise<MCPToolResponse> {
    const response = await fetch(`${this.baseUrl}/api/mcp/tools/call`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(toolCall),
    });

    if (!response.ok) {
      throw new Error(`Tool call failed: ${response.statusText}`);
    }

    return response.json();
  }

  async interpretMessage(message: string): Promise<ReadableStream<MCPStreamChunk>> {
    const response = await fetch(`${this.baseUrl}/api/mcp/interpret`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`Message interpretation failed: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('No response body');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    return new ReadableStream({
      start(controller) {
        function pump(): Promise<void> {
          return reader.read().then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim());

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));
                  controller.enqueue(data);
                } catch (error) {
                  console.error('Failed to parse SSE data:', error);
                }
              }
            }

            return pump();
          });
        }

        return pump();
      },
    });
  }

  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export * from '@repo/mcp-types';
