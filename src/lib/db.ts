import type { APIContext } from "astro";
import { drizzle } from "drizzle-orm/d1";

export const getDb = (ctx: APIContext) => {
	return drizzle(ctx.locals.runtime.env.DB);
}
