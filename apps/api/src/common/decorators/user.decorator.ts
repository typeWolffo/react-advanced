import { createParamDecorator, type ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  const user = request.user;

  if (!user) {
    return null;
  }

  if (data) {
    return user[data];
  }

  return user;
});
