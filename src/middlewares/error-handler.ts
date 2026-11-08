import * as ERR from "@utils/main-error";
import type { HTTPResponseError } from "hono/types";
import type { Context } from "hono";
import { httpResponse } from "@utils/http-response";
import { responseMessage } from "@utils/response-message";
import { DrizzleQueryError } from "drizzle-orm";

export function errorHandler(error: Error | HTTPResponseError, c: Context) {
  try {
    if (error instanceof DrizzleQueryError) {
      const message = error.cause?.message;

      if (message?.endsWith("UNIQUE constraint failed: providers.code")) {
        throw new ERR.ConflictError(responseMessage.conflict);
      }

      if (message?.endsWith("FOREIGN KEY constraint failed")) {
        throw new ERR.ConflictError(responseMessage.foreignKey);
      }

      throw new ERR.DatabaseError(responseMessage.database);
    } else {
      throw error;
    }
  } catch (error) {
    if (error instanceof ERR.MainError) {
      return c.json(httpResponse.error(error.code, error.message), error.status);
    }

    return c.json(httpResponse.error("ERR_INTERNAL_SERVER", "Internal Server Error"), 500);
  }
}
