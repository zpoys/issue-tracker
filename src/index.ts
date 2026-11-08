import * as dto from "./dto";
import * as schema from "@db/schema";
import { Hono } from "hono";
import { db } from "@db/client";
import { sign } from "hono/jwt";
import { cors } from "hono/cors";
import { envConfig } from "@configs/env";
import { auth } from "@middlewares/auth";
import { validateEnv } from "@utils/validator";
import { verifyPassword } from "@utils/security";
import { httpResponse } from "@utils/http-response";
import { deleteCookie, setCookie } from "hono/cookie";
import { BadRequestError, UnauthorizedError } from "@utils/main-error";
import { myValidator } from "@middlewares/my-validator";
import { responseMessage } from "@utils/response-message";
import { errorHandler } from "@middlewares/error-handler";
import { parseFilterCondition } from "@utils/filter-condition";
import { and, count, desc, eq, gte, lt, type SQL } from "drizzle-orm";

validateEnv();

const app = new Hono();

app.onError(errorHandler);
app.use(
  cors({
    origin: envConfig.feUrl,
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  }),
);

const COOKIE_NAME = "access_token";
const TOKEN_EXPIRES_IN = 60 * 60 * 12; // 12 jam

// LOGIN
app.post("/auth/login", myValidator(dto.loginUserBodySchema, "json"), async (c) => {
  const body = c.get("json");
  const isUsernameValid = body.username === envConfig.authUsername;
  const isPasswordValid = await verifyPassword(body.password, envConfig.authPasswordHash);

  if (!isUsernameValid || !isPasswordValid) {
    throw new UnauthorizedError(responseMessage.invalidCredentials);
  }

  const now = Math.floor(Date.now() / 1000);
  const token = await sign(
    {
      sub: envConfig.authUsername,
      iat: now,
      exp: now + TOKEN_EXPIRES_IN,
    },
    envConfig.jwtSecret,
    "HS256",
  );

  setCookie(c, COOKIE_NAME, token, {
    httpOnly: true,
    secure: envConfig.nodeEnv === "production",
    sameSite: "Lax",
    path: "/",
    maxAge: TOKEN_EXPIRES_IN,
  });

  return c.json(
    httpResponse.success({ username: envConfig.authUsername }, responseMessage.success),
    200,
  );
});

// AUTH
app.use(auth());

// ME
app.get("/me", (c) => {
  return c.json(
    httpResponse.success({ username: envConfig.authUsername }, responseMessage.success),
    200,
  );
});

// LOGOUT
app.post("/auth/logout", (c) => {
  deleteCookie(c, COOKIE_NAME, {
    path: "/",
  });

  return c.json(
    httpResponse.success({ username: envConfig.authUsername }, responseMessage.success),
    200,
  );
});

// CREATE ISSUE
app.post("/issues/create", myValidator(dto.createIssueBodySchema, "json"), async (c) => {
  const body = c.get("json");
  const [result] = await db.insert(schema.issues).values(body).returning({
    id: schema.issues.id,
  });

  return c.json(httpResponse.success(result ?? null, responseMessage.created), 201);
});

// FIND ISSUE
app.get("/issues/find", myValidator(dto.findIssueQuerySchema, "query"), async (c) => {
  const query = c.get("query");
  const conditions: (SQL | undefined)[] = [];

  if (query.status !== undefined) {
    conditions.push(eq(schema.issues.status, query.status));
  }

  if (query.priority !== undefined) {
    conditions.push(eq(schema.issues.priority, query.priority));
  }

  if (query.title !== undefined) {
    conditions.push(parseFilterCondition(schema.issues.title, query.title));
  }

  if (query.description !== undefined) {
    conditions.push(parseFilterCondition(schema.issues.description, query.description));
  }

  if (query.createdAtFrom !== undefined) {
    const date = new Date(`${query.createdAtFrom}T00:00:00.000Z`);

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestError(responseMessage.badRequest);
    }

    conditions.push(gte(schema.issues.createdAt, date));
  }

  if (query.createdAtTo !== undefined) {
    const date = new Date(`${query.createdAtTo}T00:00:00.000Z`);

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestError(responseMessage.badRequest);
    }

    date.setUTCDate(date.getUTCDate() + 1);

    conditions.push(lt(schema.issues.createdAt, date));
  }

  const finalCondition =
    conditions.length === 1
      ? conditions[0]
      : conditions.length > 1
        ? and(...conditions)
        : undefined;

  const limit = query.limit ?? 50;
  const offset = query.offset ?? 0;
  const [result, totalResult] = await Promise.all([
    db
      .select()
      .from(schema.issues)
      .where(finalCondition)
      .orderBy(desc(schema.issues.id))
      .limit(limit)
      .offset(offset),

    db.select({ total: count() }).from(schema.issues).where(finalCondition),
  ]);

  const total = totalResult[0]?.total || 0;
  const meta = {
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + result.length < total,
    },
  };

  return c.json(httpResponse.success(result, responseMessage.success, meta), 200);
});

// UPDATE ISSUE STATUS
app.post(
  "/issues/update-status/:id",
  myValidator(dto.updateIssueStatusBodySchema, "json"),
  async (c) => {
    const body = c.get("json");
    const param = c.req.param();
    const id = Number(param.id);

    if (!Number.isFinite(id)) {
      throw new BadRequestError(responseMessage.badRequest);
    }

    const [result] = await db
      .update(schema.issues)
      .set({
        status: body.status,
      })
      .where(eq(schema.issues.id, id))
      .returning({
        id: schema.issues.id,
      });

    return c.json(httpResponse.success(result ?? null, responseMessage.updated), 200);
  },
);

// DELETE ISSUE
app.post("/issues/delete/:id", async (c) => {
  const param = c.req.param();
  const id = Number(param.id);

  if (!Number.isFinite(id)) {
    throw new BadRequestError(responseMessage.badRequest);
  }

  const [result] = await db.delete(schema.issues).where(eq(schema.issues.id, id)).returning({
    id: schema.issues.id,
  });

  return c.json(httpResponse.success(result ?? null, responseMessage.deleted), 200);
});

export default {
  port: 3001,
  fetch: app.fetch,
};
