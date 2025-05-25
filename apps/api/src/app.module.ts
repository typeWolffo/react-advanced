import { DrizzlePostgresModule } from "@knaadh/nestjs-drizzle-postgres";
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import database from './common/configuration/database';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';
import * as schema from "./database/schema";

import awsConfig from "./common/configuration/aws";
import emailConfig from "./common/configuration/email";
import jwtConfig from "./common/configuration/jwt";
import redisConfig from "./common/configuration/redis";
import s3Config from "./common/configuration/s3";
import { AuthModule } from "./auth/auth.module";
import { TasksModule } from "./tasks/tasks.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [
              database,
              jwtConfig,
              emailConfig,
              awsConfig,
              s3Config,
              redisConfig,
            ],
            isGlobal: true,
          }),
          DrizzlePostgresModule.registerAsync({
            tag: "DB",
            useFactory(configService: ConfigService) {
              return {
                postgres: {
                  url: configService.get<string>("database.url")!,
                  config: {
                    max: configService.get<number>("database.pool") ?? 20,
                  },
                },
                config: {
                  schema: { ...schema },
                },
              };
            },
            inject: [ConfigService],
          }),
          JwtModule.registerAsync({
            useFactory(configService: ConfigService) {
              return {
                secret: configService.get<string>("jwt.secret")!,
                signOptions: {
                  expiresIn: configService.get<string>("jwt.expirationTime"),
                },
              };
            },
            inject: [ConfigService],
            global: true,
          }),
    HealthModule,
    UserModule,
    AuthModule,
    TasksModule,
    ],
    providers: [
      {
        provide: APP_GUARD,
        useClass: JwtAuthGuard,
      },
    ],
})
export class AppModule {}
