import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Validate } from 'nestjs-typebox';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';
import { TasksService } from './tasks.service';
import { CreateTaskSchema, CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskSchema, UpdateTaskDto } from './dto/update-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  @Validate({
    request: [{ type: 'body', schema: CreateTaskSchema }],
  })
  create(@Body() createTaskDto: CreateTaskDto, @Request() req: any) {
    return this.tasksService.create(createTaskDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully' })
  findAll(@Query() query: QueryTasksDto, @Request() req: any) {
    return this.tasksService.findAll(req.user.userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific task by ID' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.tasksService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req: any,
  ) {
    return this.tasksService.update(id, updateTaskDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.tasksService.remove(id, req.user.userId);
  }

  // Internal endpoints for MCP (no auth required)
  @Public()
  @Post('internal/mcp')
  @ApiOperation({ summary: 'Create task via MCP (internal)' })
  createInternal(@Body() createTaskDto: CreateTaskDto) {
    // Use hardcoded user ID for MCP operations
    const mcpUserId = 'a339940f-0c17-4eeb-85e1-fe026d2bcc08';
    return this.tasksService.create(createTaskDto, mcpUserId);
  }

  @Public()
  @Get('internal/mcp')
  @ApiOperation({ summary: 'Get tasks via MCP (internal)' })
  findAllInternal(@Query() query: QueryTasksDto) {
    const mcpUserId = 'a339940f-0c17-4eeb-85e1-fe026d2bcc08';
    return this.tasksService.findAll(mcpUserId, query);
  }

  @Public()
  @Patch('internal/mcp/:id')
  @ApiOperation({ summary: 'Update task via MCP (internal)' })
  updateInternal(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const mcpUserId = 'a339940f-0c17-4eeb-85e1-fe026d2bcc08';
    return this.tasksService.update(id, updateTaskDto, mcpUserId);
  }

  @Public()
  @Delete('internal/mcp/:id')
  @ApiOperation({ summary: 'Delete task via MCP (internal)' })
  removeInternal(@Param('id') id: string) {
    const mcpUserId = 'a339940f-0c17-4eeb-85e1-fe026d2bcc08';
    return this.tasksService.remove(id, mcpUserId);
  }
}
