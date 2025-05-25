import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { eq, and, ilike, or, desc } from 'drizzle-orm';
import { tasks, Task, NewTask } from '../database/schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';
import { DatabasePg } from '../common';

@Injectable()
export class TasksService {
  constructor(
    @Inject('DB') private readonly db: DatabasePg,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const newTask: NewTask = {
      title: createTaskDto.title,
      userId,
      updatedAt: new Date().toISOString(),
      ...(createTaskDto.description && { description: createTaskDto.description }),
      ...(createTaskDto.priority && { priority: createTaskDto.priority }),
      ...(createTaskDto.dueDate && { dueDate: createTaskDto.dueDate }),
    };

    const [task] = await this.db.insert(tasks).values(newTask).returning();
    return task;
  }

  async findAll(userId: string, query: QueryTasksDto = {}): Promise<Task[]> {
    const { completed, priority, search, limit = 50, offset = 0 } = query;

    const conditions = [eq(tasks.userId, userId)];

    if (completed !== undefined) {
      conditions.push(eq(tasks.completed, completed));
    }

    if (priority) {
      conditions.push(eq(tasks.priority, priority));
    }

    if (search) {
      conditions.push(ilike(tasks.title, `%${search}%`));
    }

    const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0]!;

    return this.db
      .select()
      .from(tasks)
      .where(whereClause)
      .orderBy(desc(tasks.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const [task] = await this.db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<Task> {
    const updateData: Partial<NewTask> = {
      updatedAt: new Date().toISOString(),
    };

    // Only add fields that are not undefined
    if (updateTaskDto.title !== undefined) updateData.title = updateTaskDto.title;
    if (updateTaskDto.description !== undefined) updateData.description = updateTaskDto.description;
    if (updateTaskDto.completed !== undefined) updateData.completed = updateTaskDto.completed;
    if (updateTaskDto.priority !== undefined) updateData.priority = updateTaskDto.priority;
    if (updateTaskDto.dueDate !== undefined) updateData.dueDate = updateTaskDto.dueDate;

    const [updatedTask] = await this.db
      .update(tasks)
      .set(updateData)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();

    if (!updatedTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return updatedTask;
  }

  async remove(id: string, userId: string): Promise<void> {
    const [deletedTask] = await this.db
      .delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();

    if (!deletedTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    // Gateway emission removed for now
  }
}
