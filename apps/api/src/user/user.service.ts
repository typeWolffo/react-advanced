import {
  Inject,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { eq } from "drizzle-orm";

import { DatabasePg } from "src/common";



import type { UUIDType } from "src/common";
import { users } from "src/database/schema/users";

@Injectable()
export class UserService {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
  ) {}

  public async getUserById(id: UUIDType) {

    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id));

    return user;
  }

  public async getUserByEmail(email: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));

    return user;
  }
}
