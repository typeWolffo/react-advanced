import { type Static, type TSchema, Type } from "@sinclair/typebox";

import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "src/database/schema";


export type DatabasePg = PostgresJsDatabase<typeof schema>;

export class BaseResponse<T> {
  data: T;

  constructor(data: T) {
    this.data = data;
  }
}

export class PaginatedResponse<
  T,
  K extends Pagination = Pagination,
  F = Record<string, unknown>,
  AF = Record<
    string,
    {
      id: string;
      [key: string]: string;
    }
  >,
> {
  data: T;
  pagination: K;
  appliedFilters?: F;
  availableFiltersBody?: AF;

  constructor(data: { data: T; pagination: K; appliedFilters?: F }) {
    Object.assign(this, data);
  }
}

export const UUIDSchema = Type.String({ format: "uuid" });
export type UUIDType = Static<typeof UUIDSchema>;

export function baseResponse(data: TSchema) {
  if (data.type === "array") {
    return Type.Object({
      data: Type.Array(data.items),
    });
  }
  return Type.Object({
    data,
  });
}

export function paginatedResponse(data: TSchema) {
  return Type.Object({
    data,
    pagination: pagination,
    appliedFilters: Type.Optional(Type.Record(Type.String(), Type.Any(), Type.Undefined())),
    availableFiltersBody: Type.Optional(Type.Record(Type.String(), Type.Any())),
  });
}

export function nullResponse() {
  return Type.Null();
}

export const pagination = Type.Object({
  totalItems: Type.Number(),
  totalPages: Type.Optional(Type.Number()),
  page: Type.Number(),
  perPage: Type.Number(),
});

export type Pagination = Static<typeof pagination>;

export const availableFilters = Type.Object({
  subjects: Type.Array(Type.Object({ id: UUIDSchema, title: Type.String() })),
  schoolClasses: Type.Array(Type.Object({ id: UUIDSchema, name: Type.String() })),
});

export type AvailableFiltersBody = Static<typeof availableFilters>;
