import { Static, Type } from '@sinclair/typebox';

export const QueryTasksSchema = Type.Object({
  completed: Type.Optional(Type.Boolean()),
  priority: Type.Optional(Type.Union([
    Type.Literal('LOW'),
    Type.Literal('MEDIUM'),
    Type.Literal('HIGH')
  ])),
  search: Type.Optional(Type.String({ maxLength: 255 })),
  limit: Type.Optional(Type.Number({ minimum: 1, maximum: 100 })),
  offset: Type.Optional(Type.Number({ minimum: 0 })),
});

export type QueryTasksDto = Static<typeof QueryTasksSchema>;
