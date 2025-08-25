import { defineConfig } from "drizzle-kit";
import { lsrSync } from "lsr";
import path from "node:path";


export function getLocalD1DB() {
	try {
		const basePath = path.resolve(".wrangler");
		const dbFile = lsrSync(basePath)
			.find((f) => f.name.endsWith(".sqlite"));

		if (!dbFile) {
			throw new Error(`.sqlite file not found in ${basePath}`);
		}

		const url = path.resolve(basePath, dbFile.path);
		console.log(`Database URL: ${url}`);
		return url;
	} catch (err) {
		console.log(`Error  ${err}`);
		return "";
	}
}

getLocalD1DB();

export default defineConfig({
	schema: "./src/db/schema.ts",
	out: "./drizzle",
	dialect: "sqlite",
	dbCredentials: {
		url: getLocalD1DB()
	},
});
