import { defineConfig } from "drizzle-kit";
import fs from "node:fs";
import path from "node:path";

export function getLocalD1DB() {
	try {
		const basePath = path.resolve(".wrangler");
		const dbFile = fs
			.readdirSync(basePath, { encoding: "utf-8", recursive: true })
			.find((f) => f.endsWith(".sqlite"));

		if (!dbFile) {
			throw new Error(`.sqlite file not found in ${basePath}`);
		}

		const url = path.resolve(basePath, dbFile);
		return url;
	} catch (err) {
		console.log(`Error  ${err}`);
		return "";
	}
}

export default defineConfig({
	schema: "./src/db/schema.ts",
	out: "./drizzle",
	dialect: "sqlite",
	dbCredentials: {
		url: getLocalD1DB()
	},
});
