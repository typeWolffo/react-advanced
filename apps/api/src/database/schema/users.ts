import { Static, Type } from '@sinclair/typebox';
import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  createdAt: timestamp("created_at", {
    mode: "string",
    withTimezone: true,
    precision: 3,
  })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", {
    mode: "string",
    withTimezone: true,
    precision: 3,
  })
});

export const credentials = pgTable("credentials", {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at", {
    mode: "string",
    withTimezone: true,
    precision: 3,
  })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const resetTokens = pgTable("reset_tokens", {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  resetToken: text("reset_token").notNull(),
  expiryDate: timestamp("expiry_date", {
    precision: 3,
    withTimezone: true,
  }).notNull(),
  createdAt: timestamp("created_at", {
    mode: "string",
    withTimezone: true,
    precision: 3,
  })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
