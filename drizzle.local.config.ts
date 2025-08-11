import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./src/db/schema.ts",
	out: "./drizzle",
	dialect: "turso",
	dbCredentials: {
		url: "http://127.0.0.1:8080",
	}
});
