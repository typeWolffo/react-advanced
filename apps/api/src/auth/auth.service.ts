import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { and, eq, getTableColumns, isNull, lte, sql } from "drizzle-orm";

import { CORS_ORIGIN } from "src/auth/consts";
import { DatabasePg, type UUIDType } from "src/common";
import { EmailService } from "src/common/emails/emails.service";
import hashPassword from "src/common/helpers/hashPassword";

import {
  credentials,
  resetTokens,
  users,
} from "../database/schema";
import { UserService } from "../user/user.service";

import { ResetPasswordService } from "./reset-password.service";
import { CommonUser } from "src/common/schemas/common-user.schema";


@Injectable()
export class AuthService {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService,
    private emailService: EmailService,
    private resetPasswordService: ResetPasswordService,
  ) {}

  public async register({
    email,
    password,
    username,
  }: {
    email: string;
    password: string;
    username: string;
  }) {
    const [existingUser] = await this.db.select().from(users).where(eq(users.email, email));

    if (existingUser) {
      throw new ConflictException("Użytkownik z tym adresem email już istnieje");
    }

    const hashedPassword = await hashPassword(password);

    return this.db.transaction(async (trx) => {
      const [newUser] = await trx
        .insert(users)
        .values({ email, username })
        .returning();

      await trx.insert(credentials).values({ userId: newUser.id, password: hashedPassword });

      return newUser;
    });
  }

  public async login(data: { email: string; password: string }) {
    const user = await this.validateUser(data.email, data.password);

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const { accessToken, refreshToken } = await this.getTokens(user);

    return {
      ...user,
      accessToken,
      refreshToken,
    };
  }

  public async currentUser(id: UUIDType) {
    const user = await this.userService.getUserById(id);

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return user;
  }

  public async refreshTokens(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>("jwt.refreshSecret"),
        ignoreExpiration: false,
      });

      const user = await this.userService.getUserById(payload.userId);
      if (!user) {
        throw new UnauthorizedException("User not found");
      }

      const tokens = await this.getTokens(user);
      return tokens;
    } catch (error) {
      throw new ForbiddenException("Invalid refresh token");
    }
  }

  public async validateUser(email: string, password: string) {
    const [userWithCredentials] = await this.db
      .select({
        id: users.id,
        email: users.email,
        password: credentials.password,
        username: users.username,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .leftJoin(credentials, eq(users.id, credentials.userId))
      .where(eq(users.email, email));

    if (!userWithCredentials || !userWithCredentials.password) return null;

    const isPasswordValid = await bcrypt.compare(password, userWithCredentials.password);

    if (!isPasswordValid) return null;

    const { password: _, ...user } = userWithCredentials;

    return user;
  }

  private async getTokens(user: CommonUser) {
    const { id: userId, email } = user;
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { userId, email },
        {
          expiresIn: this.configService.get<string>("jwt.expirationTime"),
          secret: this.configService.get<string>("jwt.secret"),
        },
      ),
      this.jwtService.signAsync(
        { userId, email },
        {
          expiresIn: "7d",
          secret: this.configService.get<string>("jwt.refreshSecret"),
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }
}
