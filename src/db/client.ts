import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { envConfig } from "@configs/env";

const client = createClient({
  url: envConfig.tursoDatabaseUrl,
  authToken: envConfig.tursoAuthToken,
});

export const db = drizzle({ client });
