import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users';

export const priorityEnum = pgEnum('priority', ['LOW', 'MEDIUM', 'HIGH']);

export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  completed: boolean('completed').default(false).notNull(),
  priority: priorityEnum('priority').default('MEDIUM').notNull(),
  dueDate: timestamp('due_date', {
    mode: 'string',
    withTimezone: true,
    precision: 3,
  }),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at', {
    mode: 'string',
    withTimezone: true,
    precision: 3,
  })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at', {
    mode: 'string',
    withTimezone: true,
    precision: 3,
  })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
