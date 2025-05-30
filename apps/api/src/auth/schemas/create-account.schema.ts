import { type Static, Type } from "@sinclair/typebox";

export const createAccountSchema = Type.Object({
  email: Type.String({ format: "email" }),
  username: Type.String({ minLength: 1, maxLength: 64 }),
  password: Type.String({ minLength: 8, maxLength: 64 }),
  confirmPassword: Type.String({ minLength: 8, maxLength: 64 }),
});

export type CreateAccountBody = Static<typeof createAccountSchema>;
