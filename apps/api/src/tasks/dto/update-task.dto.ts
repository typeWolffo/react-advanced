import { Static, Type } from '@sinclair/typebox';

export const UpdateTaskSchema = Type.Object({
  title: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
  description: Type.Optional(Type.String({ maxLength: 1000 })),
  completed: Type.Optional(Type.Boolean()),
  priority: Type.Optional(Type.Union([
    Type.Literal('LOW'),
    Type.Literal('MEDIUM'),
    Type.Literal('HIGH')
  ])),
  dueDate: Type.Optional(Type.String({ format: 'date-time' })),
});

export type UpdateTaskDto = Static<typeof UpdateTaskSchema>;
