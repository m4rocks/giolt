import { defineMiddleware, sequence } from "astro:middleware";
import { clerkMiddleware } from "@clerk/astro/server";
import { getDb } from "./lib/db";

const BASE_TENANT_HOST =
	import.meta.env.PROD ? "giolt.org" : "localhost";

const RESERVED = new Set(["www"]);
const EXCLUDED_PATHS = new Set(["/_image"]);
const devTenantMiddleware = defineMiddleware(async (ctx, next) => {
	const url = new URL(ctx.request.url);
	const host = url.hostname;

	if (host.endsWith(`.${BASE_TENANT_HOST}`)) {
		const sub = host.slice(0, -`.${BASE_TENANT_HOST}`.length);

		if (sub && !RESERVED.has(sub)) {
			const alreadyMapped = url.pathname.startsWith(`/org/${sub}`);
			if (!alreadyMapped) {
				if (
					[...EXCLUDED_PATHS].some((p) => url.pathname.startsWith(p))
				) {
					return next();
				}
				const target = new URL(
					`/org/${sub}${url.pathname}${url.search}`,
					url,
				);
				return ctx.rewrite(target);
			}
		}
	}

	return next();
});

const conditionalClerkMiddleware = defineMiddleware(async (ctx, next) => {
	const url = new URL(ctx.request.url);
	const host = url.hostname;

	if (host.endsWith(`.${BASE_TENANT_HOST}`)) {
		return next();
	}
	const handler = clerkMiddleware();

	return handler(ctx, next) as Promise<Response>;
});

const databaseMiddleware = defineMiddleware((ctx, next) => {
	ctx.locals.db = getDb(ctx);
	return next()
})

export const onRequest = sequence(conditionalClerkMiddleware, databaseMiddleware, import.meta.env.DEV ? devTenantMiddleware : (_, next) => next());
