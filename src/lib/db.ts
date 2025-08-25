import type { APIContext } from "astro";
import * as schema from "@/db/schema";
import { drizzle } from "drizzle-orm/d1";

export const getDb = (ctx: APIContext) => {
	return drizzle(ctx.locals.runtime.env.DB, { schema });
}
