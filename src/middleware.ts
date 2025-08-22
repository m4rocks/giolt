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
				const res = await ctx.rewrite(target);

				if (res.status.toString().startsWith("30")) {
					return ctx.redirect(res.headers.get("Location") || "/");
				} else {
					return res;
				}
			}
		}
	}

	return next();
});

export const onRequest = sequence(clerkMiddleware(), tenantMiddleware);
