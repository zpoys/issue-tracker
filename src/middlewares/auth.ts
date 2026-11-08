import { envConfig } from "@configs/env";
import { UnauthorizedError } from "@utils/main-error";
import { responseMessage } from "@utils/response-message";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";

export function auth() {
  return createMiddleware(async (c, next) => {
    const token = getCookie(c, "access_token");

    if (!token) {
      throw new UnauthorizedError(responseMessage.unauthorized);
    }

    try {
      await verify(token, envConfig.jwtSecret, "HS256");

      await next();
    } catch {
      throw new UnauthorizedError(responseMessage.invalidToken);
    }
  });
}
