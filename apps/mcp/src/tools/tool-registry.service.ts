import { Injectable } from '@nestjs/common';
import { MCPToolSchema, MCPToolCall, MCPToolResponse } from '@repo/mcp-types';
import { TaskToolsService } from './task-tools.service';

@Injectable()
export class ToolRegistryService {
  private tools: Map<string, MCPToolSchema> = new Map();
  private toolHandlers: Map<string, (args: any) => Promise<MCPToolResponse>> = new Map();

  constructor(private readonly taskToolsService: TaskToolsService) {
    this.registerTools();
  }

  private registerTools() {
    const taskTools = this.taskToolsService.getToolSchemas();

    taskTools.forEach((tool: MCPToolSchema) => {
      this.tools.set(tool.name, tool);
    });

    this.toolHandlers.set('create_task', this.taskToolsService.createTask.bind(this.taskToolsService));
    this.toolHandlers.set('update_task', this.taskToolsService.updateTask.bind(this.taskToolsService));
    this.toolHandlers.set('delete_task', this.taskToolsService.deleteTask.bind(this.taskToolsService));
    this.toolHandlers.set('get_tasks', this.taskToolsService.getTasks.bind(this.taskToolsService));
    this.toolHandlers.set('search_tasks', this.taskToolsService.searchTasks.bind(this.taskToolsService));
    this.toolHandlers.set('complete_task_by_search', this.taskToolsService.completeTaskBySearch.bind(this.taskToolsService));
  }

  getAvailableTools(): MCPToolSchema[] {
    return Array.from(this.tools.values());
  }

  async callTool(toolCall: MCPToolCall): Promise<MCPToolResponse> {
    const handler = this.toolHandlers.get(toolCall.name);

    if (!handler) {
      return {
        content: [{
          type: 'text',
          text: `Unknown tool: ${toolCall.name}`,
        }],
        isError: true,
      };
    }

    try {
      return await handler(toolCall.arguments);
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error executing tool ${toolCall.name}: ${(error as Error).message}`,
        }],
        isError: true,
      };
    }
  }
}
