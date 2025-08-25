import type { APIContext } from "astro";
import { TURSO_AUTH_TOKEN, TURSO_DATABASE_URL } from "astro:env/server";
import { drizzle } from "drizzle-orm/d1";

export const getDb = (ctx: APIContext) => {
	return drizzle(ctx.locals.runtime.env.DB);
}
