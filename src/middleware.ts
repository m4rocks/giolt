import { VERCEL_ENV } from "astro:env/server";
import { defineMiddleware, sequence } from "astro:middleware";
import { clerkMiddleware } from "@clerk/astro/server";

const BASE_TENANT_HOST =
	VERCEL_ENV === "production"
		? "giolt.org"
		: "localhost";
const RESERVED = new Set(["www"]);
const EXCLUDED_PATHS = new Set(["/_image"]);

const tenantMiddleware = defineMiddleware(async (ctx, next) => {
	const url = new URL(ctx.request.url);
	const host = url.hostname;
	console.log(url.href);

	if (host.endsWith(`.${BASE_TENANT_HOST}`)) {
		const sub = host.slice(0, -`.${BASE_TENANT_HOST}`.length);

		if (sub && !RESERVED.has(sub)) {
			const alreadyMapped = url.pathname.startsWith(`/org/${sub}`);
			if (!alreadyMapped) {
				if ([...EXCLUDED_PATHS].some((p) => url.pathname.startsWith(p))) {
					return next();
				}
				const target = new URL(
					`/org/${sub}${url.pathname}${url.search}`,
					url,
				);
				console.log(target.href);

				const method = ctx.request.method.toUpperCase();
				if (method === "GET" || method === "HEAD") {
					return ctx.redirect(target.href, 302);
				}
				return ctx.rewrite(target);
			}
		}
	}

	// optional: if someone hits the apex giolt.org, send them to giolt.com
	// not needed at the moment as the redirect is handled by vercel
	// if (host === BASE_HOST) {
	// 	return ctx.redirect(
	// 		`https://giolt.com${url.pathname}${url.search}`,
	// 		308,
	// 	);
	// }

	return next();
});

export const onRequest = sequence(tenantMiddleware, clerkMiddleware());
