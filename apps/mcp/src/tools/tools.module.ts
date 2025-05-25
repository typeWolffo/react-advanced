import { Module } from '@nestjs/common';
import { ToolRegistryService } from './tool-registry.service';
import { TaskToolsService } from './task-tools.service';

@Module({
  providers: [ToolRegistryService, TaskToolsService],
  exports: [ToolRegistryService, TaskToolsService],
})
export class ToolsModule {}
