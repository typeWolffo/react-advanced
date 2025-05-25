import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Type } from "@sinclair/typebox";
import { type Request, Response } from "express";
import { Validate } from "nestjs-typebox";

import { baseResponse, BaseResponse, nullResponse, type UUIDType } from "src/common";
import { Public } from "src/common/decorators/public.decorator";
import { Roles } from "src/common/decorators/roles.decorator";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { RefreshTokenGuard } from "src/common/guards/refresh-token.guard";
import hashPassword from "src/common/helpers/hashPassword";

import { AuthService } from "./auth.service";
import { CreateAccountBody, createAccountSchema } from "./schemas/create-account.schema";
import { type CreatePasswordBody, createPasswordSchema } from "./schemas/create-password.schema";
import { LoginBody, loginSchema } from "./schemas/login.schema";
import {
  ForgotPasswordBody,
  forgotPasswordSchema,
  ResetPasswordBody,
  resetPasswordSchema,
} from "./schemas/reset-password.schema";
import { TokenService } from "./token.service";

import type { Static } from "@sinclair/typebox";
import { baseUserSchema, safeUserSchema, loginUserSchema } from "src/common/schemas/common-user.schema";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @Public()
  @Post("register")
  @Validate({
    request: [{ type: "body", schema: createAccountSchema }],
    response: baseResponse(baseUserSchema),
  })
  async register(data: CreateAccountBody): Promise<BaseResponse<Static<typeof baseUserSchema>>> {
    const account = await this.authService.register(data);

    return new BaseResponse(account);
  }

  @Public()
  @UseGuards(AuthGuard("local"))
  @Post("login")
  @Validate({
    request: [{ type: "body", schema: loginSchema }],
    response: baseResponse(loginUserSchema),
  })
  async login(
    @Body() data: LoginBody,
    @Res({ passthrough: true }) response: Response,
  ): Promise<BaseResponse<Static<typeof loginUserSchema>>> {
    const { accessToken, refreshToken, ...account } = await this.authService.login(data);

    this.tokenService.setTokenCookies(response, accessToken, refreshToken, data?.rememberMe);

    return new BaseResponse({ ...account, accessToken });
  }

  @Post("logout")
  @Validate({
    response: nullResponse(),
  })
  async logout(@Res({ passthrough: true }) response: Response): Promise<null> {
    this.tokenService.clearTokenCookies(response);

    return null;
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post("refresh")
  @Validate({
    response: nullResponse(),
  })
  async refreshTokens(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request & { refreshToken: UUIDType },
  ): Promise<null> {
    const refreshToken = request["refreshToken"];

    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token not found");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refreshTokens(refreshToken);

    this.tokenService.setTokenCookies(response, accessToken, newRefreshToken);

    return null;
  }

  @Get("current-user")
  @Validate({
    response: baseResponse(safeUserSchema),
  })
  async currentUser(
    @CurrentUser("userId") currentUserId: UUIDType,
  ): Promise<BaseResponse<Static<typeof safeUserSchema>>> {
    const account = await this.authService.currentUser(currentUserId);


    return new BaseResponse(account);
  }
}
