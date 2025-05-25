import { Static, Type } from "@sinclair/typebox";
import { createSelectSchema } from "drizzle-typebox";
import { users } from "src/database/schema";


export const baseUserSchema = createSelectSchema(users);
export const safeUserSchema = Type.Omit(baseUserSchema, ["password"]);
export const loginUserSchema = Type.Intersect([
  safeUserSchema,
  Type.Object({
    accessToken: Type.String()
  })
]);

export type CommonUser = Static<typeof safeUserSchema>
export type LoginUser = Static<typeof loginUserSchema>
