import { rewrite, next } from "@vercel/functions";

export const config = {
	runtime: 'edge'
};

const BASE_TENANT_HOST =
	process.env.VERCEL_ENV === "production"
		? "giolt.org"
		: process.env.VERCEL_ENV === "preview"
			? "dev.giolt.org"
			: "localhost";
const RESERVED = new Set(["www"]);
const EXCLUDED_PATHS = new Set(["/_image"]);

export default function middleware(request: Request) {
	const url = new URL(request.url);
	const host = url.hostname;

	if (host.endsWith(`.${BASE_TENANT_HOST}`)) {
		const sub = host.slice(0, -`.${BASE_TENANT_HOST}`.length);

		if (sub && !RESERVED.has(sub)) {
			const alreadyMapped = url.pathname.startsWith(`/org/${sub}`);
			if (!alreadyMapped) {
				if (EXCLUDED_PATHS.has(url.pathname)) {
					return next();
				}
				const target = new URL(
					`/org/${sub}${url.pathname}${url.search}`,
					url,
				);
				return rewrite(target);
			}
		}
	}

	return next();
}
