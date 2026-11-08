export function validateEnv(): void {
  const requiredKeys: string[] = [
    "NODE_ENV",
    "AUTH_USERNAME",
    "AUTH_PASSWORD_HASH",
    "JWT_SECRET",
    "TURSO_DATABASE_URL",
    "TURSO_AUTH_TOKEN",
    "FE_URL",
  ];

  requiredKeys.forEach((requiredKey) => {
    if (!Object.keys(Bun.env).includes(requiredKey)) {
      throw new Error(`${requiredKey} not found in .env`);
    }
  });
}
