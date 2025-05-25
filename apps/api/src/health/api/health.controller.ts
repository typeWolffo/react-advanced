import { Controller, Get } from "@nestjs/common";
import { HealthCheckService, HealthCheck } from "@nestjs/terminus";


@Controller("healthcheck")
export class HealthController {
  constructor(private health: HealthCheckService) {}

  @Get()
  @HealthCheck()
  async check() {
    return this.health.check([]);
  }
}
