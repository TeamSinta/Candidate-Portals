import { type Config } from "drizzle-kit";

export default {
  schema: "./app/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_DATABASE_URL ?? "",
  },
  tablesFilter: ["teamsinta_candidate_portals_*"],
} satisfies Config;
