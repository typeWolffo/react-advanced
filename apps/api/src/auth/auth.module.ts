import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";

import { EmailModule } from "src/common/emails/emails.module";
import { UserModule } from "src/user/user.module";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { ResetPasswordService } from "./reset-password.service";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { LocalStrategy } from "./strategy/local.strategy";
import { TokenService } from "./token.service";

@Module({
  imports: [PassportModule, EmailModule, UserModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    JwtStrategy,
    LocalStrategy,
    ResetPasswordService,
  ],
  exports: [AuthService, TokenService],
})
export class AuthModule {}
