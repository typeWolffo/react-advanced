import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { McpModule } from './mcp/mcp.module';
import { ToolsModule } from './tools/tools.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    McpModule,
    ToolsModule,
  ],
})
export class AppModule {}
