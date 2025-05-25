import { Injectable } from '@nestjs/common';
import { MCPStreamChunk, MCPToolCall } from '@repo/mcp-types';
import { ToolRegistryService } from '../tools/tool-registry.service';
import { AnthropicService } from '../anthropic/anthropic.service';

@Injectable()
export class McpService {
  constructor(
    private readonly toolRegistry: ToolRegistryService,
    private readonly anthropicService: AnthropicService,
  ) {}

  async *interpretMessage(message: string): AsyncGenerator<MCPStreamChunk> {
    yield {
      type: 'text',
      content: '🤖 Analyzing your request with Claude AI...',
    };

    try {
      // First, analyze the intent using Claude
      const intentAnalysis = await this.anthropicService.analyzeTaskIntent(message);

      if (intentAnalysis.confidence > 0.7 && intentAnalysis.intent !== 'unknown') {
        // Execute the tool if we have high confidence
        const toolCall = this.buildToolCallFromIntent(intentAnalysis);

        if (toolCall) {
          yield {
            type: 'tool_call',
            content: `🔧 Executing: ${toolCall.name}`,
            toolCall,
          };

          try {
            const toolResponse = await this.toolRegistry.callTool(toolCall);

            yield {
              type: 'tool_response',
              content: toolResponse.content[0]?.text || 'Tool executed successfully',
              toolResponse,
            };
          } catch (error) {
            yield {
              type: 'error',
              content: `❌ Error executing tool: ${(error as Error).message}`,
            };
            return;
          }
        }
      }

      // Generate Claude's conversational response
      const responseStream = this.anthropicService.generateStreamingResponse(
        message,
        intentAnalysis.intent !== 'unknown' ? `Intent: ${intentAnalysis.intent}, Confidence: ${intentAnalysis.confidence}` : undefined
      );

      for await (const chunk of responseStream) {
        yield {
          type: 'text',
          content: chunk,
        };
      }

    } catch (error) {
      console.error('Claude AI error:', error);
      yield {
        type: 'error',
        content: '❌ Sorry, I encountered an error processing your request. Please try again.',
      };
    }
  }

  private parseMessageForToolCall(message: string): MCPToolCall | null {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('create') || lowerMessage.includes('add') || lowerMessage.includes('new task')) {
      const title = this.extractTaskTitle(message);
      const priority = this.extractPriority(message);
      const dueDate = this.extractDueDate(message);

      if (title) {
        return {
          name: 'create_task',
          arguments: {
            title,
            ...(priority && { priority }),
            ...(dueDate && { dueDate }),
          },
        };
      }
    }

    if (lowerMessage.includes('show') || lowerMessage.includes('list') || lowerMessage.includes('get tasks')) {
      const completed = this.extractCompletedFilter(message);
      const priority = this.extractPriority(message);

      return {
        name: 'get_tasks',
        arguments: {
          ...(completed !== null && { completed }),
          ...(priority && { priority }),
          limit: 10,
        },
      };
    }

    if (lowerMessage.includes('search') || lowerMessage.includes('find')) {
      const searchTerm = this.extractSearchTerm(message);
      if (searchTerm) {
        return {
          name: 'search_tasks',
          arguments: {
            search: searchTerm,
          },
        };
      }
    }

    if (lowerMessage.includes('complete') || lowerMessage.includes('done') || lowerMessage.includes('finish')) {
      const taskId = this.extractTaskId(message);
      if (taskId) {
        return {
          name: 'update_task',
          arguments: {
            id: taskId,
            completed: true,
          },
        };
      }
    }

    if (lowerMessage.includes('delete') || lowerMessage.includes('remove')) {
      const taskId = this.extractTaskId(message);
      if (taskId) {
        return {
          name: 'delete_task',
          arguments: {
            id: taskId,
          },
        };
      }
    }

    return null;
  }

  private extractTaskTitle(message: string): string | null {
    const patterns = [
      /create.*task[:\s]+(.+?)(?:\s+with|$)/i,
      /add.*task[:\s]+(.+?)(?:\s+with|$)/i,
      /new task[:\s]+(.+?)(?:\s+with|$)/i,
      /"([^"]+)"/,
      /'([^']+)'/,
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return null;
  }

  private extractPriority(message: string): 'LOW' | 'MEDIUM' | 'HIGH' | null {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('high priority') || lowerMessage.includes('urgent') || lowerMessage.includes('important')) {
      return 'HIGH';
    }
    if (lowerMessage.includes('medium priority') || lowerMessage.includes('normal')) {
      return 'MEDIUM';
    }
    if (lowerMessage.includes('low priority') || lowerMessage.includes('later')) {
      return 'LOW';
    }

    return null;
  }

  private extractDueDate(message: string): string | null {
    const datePatterns = [
      /tomorrow/i,
      /today/i,
      /next week/i,
      /\d{4}-\d{2}-\d{2}/,
    ];

    for (const pattern of datePatterns) {
      if (pattern.test(message)) {
        if (/tomorrow/i.test(message)) {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          return tomorrow.toISOString();
        }
        if (/today/i.test(message)) {
          return new Date().toISOString();
        }
        if (/next week/i.test(message)) {
          const nextWeek = new Date();
          nextWeek.setDate(nextWeek.getDate() + 7);
          return nextWeek.toISOString();
        }
      }
    }

    return null;
  }

  private extractCompletedFilter(message: string): boolean | null {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('completed') || lowerMessage.includes('done')) {
      return true;
    }
    if (lowerMessage.includes('pending') || lowerMessage.includes('incomplete')) {
      return false;
    }

    return null;
  }

  private extractSearchTerm(message: string): string | null {
    const patterns = [
      /search.*for[:\s]+(.+?)(?:\s+in|$)/i,
      /find.*tasks.*about[:\s]+(.+?)(?:\s+in|$)/i,
      /search[:\s]+(.+?)(?:\s+in|$)/i,
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return null;
  }

  private extractTaskId(message: string): string | null {
    const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
    const match = message.match(uuidPattern);
    return match ? match[0] : null;
  }

  private buildToolCallFromIntent(intentAnalysis: any): MCPToolCall | null {
    const { intent, taskData } = intentAnalysis;

    switch (intent) {
      case 'create':
        if (taskData?.title) {
          return {
            name: 'create_task',
            arguments: {
              title: taskData.title,
              ...(taskData.description && { description: taskData.description }),
              ...(taskData.priority && { priority: taskData.priority }),
              ...(taskData.dueDate && { dueDate: taskData.dueDate }),
            },
          };
        }
        break;

      case 'update':
        if (taskData?.id) {
          return {
            name: 'update_task',
            arguments: {
              id: taskData.id,
              ...(taskData.title && { title: taskData.title }),
              ...(taskData.description && { description: taskData.description }),
              ...(taskData.priority && { priority: taskData.priority }),
              ...(taskData.completed !== undefined && { completed: taskData.completed }),
              ...(taskData.dueDate && { dueDate: taskData.dueDate }),
            },
          };
        }
        break;

      case 'complete':
        if (taskData?.searchQuery) {
          return {
            name: 'complete_task_by_search',
            arguments: {
              searchQuery: taskData.searchQuery,
            },
          };
        }
        break;

      case 'delete':
        if (taskData?.id || taskData?.searchQuery) {
          if (taskData.id) {
            return {
              name: 'delete_task',
              arguments: {
                id: taskData.id,
              },
            };
          } else {
            return {
              name: 'search_tasks',
              arguments: {
                search: taskData.searchQuery,
              },
            };
          }
        }
        break;

      case 'get':
        return {
          name: 'get_tasks',
          arguments: {
            ...(taskData?.completed !== undefined && { completed: taskData.completed }),
            ...(taskData?.priority && { priority: taskData.priority }),
            limit: 20,
          },
        };

      case 'search':
        if (taskData?.searchQuery) {
          return {
            name: 'search_tasks',
            arguments: {
              search: taskData.searchQuery,
            },
          };
        }
        break;
    }

    return null;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
