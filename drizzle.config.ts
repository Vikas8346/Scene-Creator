import { type Config } from "drizzle-kit";

import { env } from "@/env";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  out: "drizzle",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["midwestcon*"],
  schemaFilter: ["public"],
} satisfies Config;

