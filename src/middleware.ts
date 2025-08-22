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

				// Always perform an internal rewrite for tenant subdomains so downstream
				// handlers see the /org/<sub> path. Capture the downstream response so
				// we can rewrite any Location headers that point back to tenant paths.
				const downstreamRes = await ctx.rewrite(target);

				// If downstream responded with a redirect to an internal /org/<sub> path,
				// convert that Location back to the tenant host (e.g. roseto.giolt.org/...)
				if (downstreamRes?.headers) {
					const loc = downstreamRes.headers.get("location");
					if (loc) {
						let newLocation = loc;
						try {
							const locUrl = new URL(loc, url);
							const internalPrefix = `/org/${sub}`;
							if (locUrl.pathname.startsWith(internalPrefix)) {
								const suffix = locUrl.pathname.slice(internalPrefix.length) + locUrl.search;
								newLocation = `${url.protocol}//${host}${suffix}`;
							}
						} catch (e) {
							// If parsing fails, ignore and leave Location as-is
						}

						if (newLocation !== loc) {
							const headers = new Headers(downstreamRes.headers);
							headers.set("location", newLocation);
							return new Response(downstreamRes.body, {
								status: downstreamRes.status,
								statusText: downstreamRes.statusText,
								headers,
							});
						}
					}
				}

				return downstreamRes;
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
