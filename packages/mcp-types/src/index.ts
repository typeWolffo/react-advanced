export interface MCPToolSchema {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface MCPToolCall {
  name: string;
  arguments: Record<string, any>;
}

export interface MCPToolResponse {
  content: Array<{
    type: 'text';
    text: string;
  }>;
  isError: boolean;
}

export interface TaskDTO {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
}

export interface QueryTasksDTO {
  completed?: boolean;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  search?: string;
  limit?: number;
  offset?: number;
}

export interface MCPServerConfig {
  port: number;
  apiUrl: string;
  corsOrigins: string[];
  anthropicApiKey?: string;
}

export interface MCPMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface MCPStreamChunk {
  type: 'text' | 'tool_call' | 'tool_response' | 'error';
  content: string;
  toolCall?: MCPToolCall;
  toolResponse?: MCPToolResponse;
}

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
