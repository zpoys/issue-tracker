export const envConfig = {
  nodeEnv: Bun.env["NODE_ENV"]!,
  authUsername: Bun.env["AUTH_USERNAME"]!,
  authPasswordHash: Bun.env["AUTH_PASSWORD_HASH"]!,
  jwtSecret: Bun.env["JWT_SECRET"]!,
  tursoDatabaseUrl: Bun.env["TURSO_DATABASE_URL"]!,
  tursoAuthToken: Bun.env["TURSO_AUTH_TOKEN"]!,
  feUrl: Bun.env["FE_URL"]!,
};
