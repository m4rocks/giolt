import { TURSO_AUTH_TOKEN, TURSO_DATABASE_URL } from "astro:env/server";
import { drizzle } from "drizzle-orm/libsql";

export const db = drizzle({
	connection: {
		url: TURSO_DATABASE_URL || "http://127.0.1:8080",
		authToken: TURSO_AUTH_TOKEN || "",
	},
});
