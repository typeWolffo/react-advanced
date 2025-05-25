import { Injectable } from '@nestjs/common';
import { MCPToolSchema, MCPToolResponse, CreateTaskDTO, UpdateTaskDTO, QueryTasksDTO } from '@repo/mcp-types';

@Injectable()
export class TaskToolsService {
  private readonly apiBaseUrl = process.env.MCP_API_URL || 'http://localhost:3000';

  getToolSchemas(): MCPToolSchema[] {
    return [
      {
        name: 'create_task',
        description: 'Create a new task',
        inputSchema: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'Task title' },
            description: { type: 'string', description: 'Task description' },
            priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'], description: 'Task priority' },
            dueDate: { type: 'string', format: 'date-time', description: 'Due date' },
          },
          required: ['title'],
        },
      },
      {
        name: 'update_task',
        description: 'Update an existing task',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Task ID' },
            title: { type: 'string', description: 'Task title' },
            description: { type: 'string', description: 'Task description' },
            completed: { type: 'boolean', description: 'Task completion status' },
            priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'], description: 'Task priority' },
            dueDate: { type: 'string', format: 'date-time', description: 'Due date' },
          },
          required: ['id'],
        },
      },
      {
        name: 'delete_task',
        description: 'Delete a task',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Task ID' },
          },
          required: ['id'],
        },
      },
      {
        name: 'get_tasks',
        description: 'Get all tasks for the user',
        inputSchema: {
          type: 'object',
          properties: {
            completed: { type: 'boolean', description: 'Filter by completion status' },
            priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'], description: 'Filter by priority' },
            limit: { type: 'number', description: 'Limit number of results' },
            offset: { type: 'number', description: 'Offset for pagination' },
          },
        },
      },
      {
        name: 'search_tasks',
        description: 'Search tasks by text',
        inputSchema: {
          type: 'object',
          properties: {
            search: { type: 'string', description: 'Search query' },
            completed: { type: 'boolean', description: 'Filter by completion status' },
            priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'], description: 'Filter by priority' },
          },
          required: ['search'],
        },
      },
      {
        name: 'complete_task_by_search',
        description: 'Complete a task by searching for it by title',
        inputSchema: {
          type: 'object',
          properties: {
            searchQuery: { type: 'string', description: 'Task title to search for and complete' },
          },
          required: ['searchQuery'],
        },
      },
    ];
  }

  async createTask(args: CreateTaskDTO): Promise<MCPToolResponse> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/tasks/internal/mcp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(args),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const task = await response.json();
      return {
        content: [{
          type: 'text',
          text: `✅ Task created successfully: "${task.title}" with ${task.priority} priority`,
        }],
        isError: false,
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ Failed to create task: ${(error as Error).message}`,
        }],
        isError: true,
      };
    }
  }

  async updateTask(args: { id: string } & UpdateTaskDTO): Promise<MCPToolResponse> {
    try {
      const { id, ...updateData } = args;
      const response = await fetch(`${this.apiBaseUrl}/api/tasks/internal/mcp/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const task = await response.json();
      return {
        content: [{
          type: 'text',
          text: `✅ Task updated successfully: "${task.title}"`,
        }],
        isError: false,
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ Failed to update task: ${(error as Error).message}`,
        }],
        isError: true,
      };
    }
  }

  async deleteTask(args: { id: string }): Promise<MCPToolResponse> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/tasks/internal/mcp/${args.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return {
        content: [{
          type: 'text',
          text: `✅ Task deleted successfully`,
        }],
        isError: false,
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ Failed to delete task: ${(error as Error).message}`,
        }],
        isError: true,
      };
    }
  }

  async getTasks(args: QueryTasksDTO = {}): Promise<MCPToolResponse> {
    try {
      const params = new URLSearchParams();
      if (args.completed !== undefined) params.append('completed', String(args.completed));
      if (args.priority) params.append('priority', args.priority);
      if (args.limit) params.append('limit', String(args.limit));
      if (args.offset) params.append('offset', String(args.offset));

      const response = await fetch(`${this.apiBaseUrl}/api/tasks/internal/mcp?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const tasks = await response.json();
      const taskList = tasks.map((task: any) =>
        `• ${task.completed ? '✅' : '⏳'} ${task.title} (${task.priority})`
      ).join('\n');

      return {
        content: [{
          type: 'text',
          text: `📋 Found ${tasks.length} tasks:\n${taskList}`,
        }],
        isError: false,
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ Failed to get tasks: ${(error as Error).message}`,
        }],
        isError: true,
      };
    }
  }

  async searchTasks(args: { search: string } & QueryTasksDTO): Promise<MCPToolResponse> {
    try {
      const params = new URLSearchParams();
      params.append('search', args.search);
      if (args.completed !== undefined) params.append('completed', String(args.completed));
      if (args.priority) params.append('priority', args.priority);

      const response = await fetch(`${this.apiBaseUrl}/api/tasks/internal/mcp?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const tasks = await response.json();
      const taskList = tasks.map((task: any) =>
        `• ${task.completed ? '✅' : '⏳'} ${task.title} (${task.priority})`
      ).join('\n');

      return {
        content: [{
          type: 'text',
          text: `🔍 Search results for "${args.search}" (${tasks.length} found):\n${taskList}`,
        }],
        isError: false,
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ Failed to search tasks: ${(error as Error).message}`,
        }],
        isError: true,
      };
    }
  }

  async completeTaskBySearch(args: { searchQuery: string }): Promise<MCPToolResponse> {
    try {
      console.log('🔍 Searching for task:', args.searchQuery);

      // First search for the task
      const params = new URLSearchParams();
      params.append('search', args.searchQuery);
      params.append('completed', 'false'); // Only search incomplete tasks

      const searchResponse = await fetch(`${this.apiBaseUrl}/api/tasks/internal/mcp?${params}`);

      console.log('🔍 Search response status:', searchResponse.status);

      if (!searchResponse.ok) {
        const errorText = await searchResponse.text();
        console.log('❌ Search error response:', errorText);
        throw new Error(`HTTP ${searchResponse.status}: ${searchResponse.statusText}`);
      }

      const tasks = await searchResponse.json();
      console.log('📋 Found tasks:', tasks.length);

      if (tasks.length === 0) {
        return {
          content: [{
            type: 'text',
            text: `❌ No incomplete tasks found matching "${args.searchQuery}"`,
          }],
          isError: false,
        };
      }

      // Find best match (exact title match or first result)
      const exactMatch = tasks.find((task: any) =>
        task.title.toLowerCase() === args.searchQuery.toLowerCase()
      );
      const taskToComplete = exactMatch || tasks[0];
      console.log('🎯 Task to complete:', taskToComplete.id, taskToComplete.title);

      // Mark as completed
      const updateResponse = await fetch(`${this.apiBaseUrl}/api/tasks/internal/mcp/${taskToComplete.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: true }),
      });

      console.log('✏️ Update response status:', updateResponse.status);

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        console.log('❌ Update error response:', errorText);
        throw new Error(`HTTP ${updateResponse.status}: ${updateResponse.statusText}`);
      }

      return {
        content: [{
          type: 'text',
          text: `✅ Completed task: "${taskToComplete.title}"`,
        }],
        isError: false,
      };
    } catch (error) {
      console.log('💥 Complete task error:', error);
      return {
        content: [{
          type: 'text',
          text: `❌ Failed to complete task: ${(error as Error).message}`,
        }],
        isError: true,
      };
    }
  }
}
