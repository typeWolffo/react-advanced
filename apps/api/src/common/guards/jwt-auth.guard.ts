import {
  Injectable,
  type CanActivate,
  type ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";

import { extractToken } from "src/utils/extract-token";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>("isPublic", [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const token = extractToken(request, "access_token");

    if (isPublic) {
      if (token) {
        try {
          const payload = await this.jwtService.verifyAsync(token, {
            secret: this.configService.get<string>("jwt.secret"),
          });
          request["user"] = payload;
        } catch {
          // eslint-disable-next-line no-console
          console.log("Skipping token validation for public endpoint");
        }
      }
      return true;
    }

    if (!token) {
      throw new UnauthorizedException("Access token not found");
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>("jwt.secret"),
      });

      request["user"] = payload;

      return true;
    } catch {
      throw new UnauthorizedException("Invalid access token");
    }
  }
}
