import { Controller, Get, Post, Body, Res, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Response } from 'express';
import { McpService } from './mcp.service';
import { ToolRegistryService } from '../tools/tool-registry.service';
import type { MCPToolCall } from '@repo/mcp-types';

@ApiTags('mcp')
@Controller('api/mcp')
export class McpController {
  constructor(
    private readonly mcpService: McpService,
    private readonly toolRegistry: ToolRegistryService,
  ) {}

  @Get('tools')
  @ApiOperation({ summary: 'Get available MCP tools' })
  @ApiResponse({ status: 200, description: 'List of available tools' })
  getTools() {
    return this.toolRegistry.getAvailableTools();
  }

  @Post('tools/call')
  @ApiOperation({ summary: 'Call an MCP tool' })
  @ApiResponse({ status: 200, description: 'Tool execution result' })
  async callTool(@Body() toolCall: MCPToolCall) {
    return this.toolRegistry.callTool(toolCall);
  }

  @Post('interpret')
  @ApiOperation({ summary: 'Interpret a message and stream AI response' })
  @ApiResponse({ status: 200, description: 'Streaming AI response' })
  async interpretMessage(
    @Body() body: { message: string },
    @Res() res: Response,
  ) {
    console.log('🎯 MCP interpret request:', body.message);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
      const stream = await this.mcpService.interpretMessage(body.message);

      for await (const chunk of stream) {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      }

      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error) {
      res.write(`data: ${JSON.stringify({
        type: 'error',
        content: `Error: ${(error as Error).message}`,
      })}\n\n`);
      res.end();
    }
  }
}
