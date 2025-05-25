import { Module } from '@nestjs/common';
import { McpController } from './mcp.controller';
import { McpService } from './mcp.service';
import { McpGateway } from './mcp.gateway';
import { ToolsModule } from '../tools/tools.module';
import { AnthropicModule } from '../anthropic/anthropic.module';

@Module({
  imports: [ToolsModule, AnthropicModule],
  controllers: [McpController],
  providers: [McpService, McpGateway],
  exports: [McpService],
})
export class McpModule {}
