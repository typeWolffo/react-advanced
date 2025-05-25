import {
  Controller,
  Get,
  Param,
  UseGuards
} from "@nestjs/common";
import { Static } from "@sinclair/typebox";
import { Validate } from "nestjs-typebox";

import {
  baseResponse,
  BaseResponse,
  UUIDSchema,
  type UUIDType
} from "src/common";
import { RolesGuard } from "src/common/guards/roles.guard";


import { baseUserSchema } from "src/common/schemas/common-user.schema";
import { UserService } from "./user.service";


@Controller("user")
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Validate({
    request: [{ type: "param", name: "id", schema: UUIDSchema, required: true }],
    response: baseResponse(baseUserSchema),
  })
  @Get("user/:id")
  async getUserById(
    @Param("id") id: UUIDType,
  ): Promise<BaseResponse<Static<typeof baseUserSchema>>> {
    const user = await this.usersService.getUserById(id);

    return new BaseResponse(user);
  }

}
