import { drizzle } from "drizzle-orm/libsql";
import { reset, seed } from "drizzle-seed";
import * as schema from "./schema";

// interface Refine {
// 	stories: {
// 		// biome-ignore lint/suspicious/noExplicitAny: This is ok to be any as we need the generators
// 		columns: Record<keyof typeof schema.organizat.$inferSelect, any>;
// 		count: number;
// 	};
// }

async function main() {
	const db = drizzle("http://127.0.0.1:8080");

	await reset(db, schema);
	await seed(db, schema);
}

main();
