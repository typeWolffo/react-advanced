import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';

@Injectable()
export class AnthropicService {
  private anthropic: Anthropic;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('ANTHROPIC_API_KEY');
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is required');
    }

    this.anthropic = new Anthropic({
      apiKey,
    });
  }

  async *generateStreamingResponse(
    message: string,
    context?: string
  ): AsyncGenerator<string, void, unknown> {
    const systemPrompt = `You are a smart task management AI. Be concise and direct.

Available tools: create_task, update_task, delete_task, get_tasks, search_tasks

Rules:
- Execute actions immediately, don't ask for confirmation
- Be brief in responses (1-2 sentences max)
- When completing tasks, find by title match first
- Extract priority: urgent/important/critical = HIGH, normal = MEDIUM, optional/later = LOW
- For "complete task X", search for task with title "X" and mark completed

${context ? `Context: ${context}` : ''}`;

    try {
      const stream = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 300,
        temperature: 0.3,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
        stream: true,
      });

      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          yield chunk.delta.text;
        }
      }
    } catch (error) {
      console.error('Anthropic API error:', error);
      yield 'Error processing request. Try again.';
    }
  }

  async generateResponse(message: string, context?: string): Promise<string> {
    const chunks: string[] = [];

    for await (const chunk of this.generateStreamingResponse(message, context)) {
      chunks.push(chunk);
    }

    return chunks.join('');
  }

  async analyzeTaskIntent(message: string): Promise<{
    intent: 'create' | 'update' | 'delete' | 'get' | 'search' | 'complete' | 'unknown';
    taskData?: {
      title?: string;
      description?: string;
      priority?: 'LOW' | 'MEDIUM' | 'HIGH';
      dueDate?: string;
      id?: string;
      completed?: boolean;
      searchQuery?: string;
    };
    confidence: number;
  }> {
    const lowerMessage = message.toLowerCase();

    // Quick pattern matching for common cases
    if (lowerMessage.includes('create') || lowerMessage.includes('add') || lowerMessage.includes('new task')) {
      const titleMatch = message.match(/(?:create|add|new task):?\s*(.+?)(?:\s+with|$)/i);
      const title = titleMatch?.[1]?.trim() || message.replace(/^(create|add|new task):?\s*/i, '').trim();

      const priority = lowerMessage.includes('high') || lowerMessage.includes('urgent') || lowerMessage.includes('important')
        ? 'HIGH'
        : lowerMessage.includes('low') || lowerMessage.includes('optional')
        ? 'LOW'
        : 'MEDIUM';

      return {
        intent: 'create',
        taskData: { title, priority },
        confidence: 0.9
      };
    }

    if (lowerMessage.includes('complete') || lowerMessage.includes('done') || lowerMessage.includes('finish')) {
      const taskMatch = message.match(/(?:complete|done|finish)\s+(?:task:?\s*)?(.+)/i);
      const title = taskMatch?.[1]?.trim() || '';

      return {
        intent: 'complete',
        taskData: { searchQuery: title, completed: true },
        confidence: 0.8
      };
    }

    if (lowerMessage.includes('show') || lowerMessage.includes('list') || lowerMessage.includes('get') || lowerMessage.includes('all')) {
      return {
        intent: 'get',
        confidence: 0.9
      };
    }

    if (lowerMessage.includes('search') || lowerMessage.includes('find')) {
      const searchMatch = message.match(/(?:search|find)\s+(.+)/i);
      const query = searchMatch?.[1]?.trim() || '';

      return {
        intent: 'search',
        taskData: { searchQuery: query },
        confidence: 0.8
      };
    }

    if (lowerMessage.includes('delete') || lowerMessage.includes('remove')) {
      const taskMatch = message.match(/(?:delete|remove)\s+(.+)/i);
      const title = taskMatch?.[1]?.trim() || '';

      return {
        intent: 'delete',
        taskData: { searchQuery: title },
        confidence: 0.7
      };
    }

    return {
      intent: 'unknown',
      confidence: 0
    };
  }
}
