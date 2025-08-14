import { rewrite, next, getEnv } from "@vercel/functions";

export const config = {
	runtime: 'edge'
};

const env = getEnv();
const BASE_TENANT_HOST = env.VERCEL_ENV === "production"
	? "giolt.org"
	: env.VERCEL_ENV === "preview"
		? "dev.giolt.org"
		: "localhost";
const RESERVED = new Set(["www"]);
const EXCLUDED_PATHS = ["/_image", "/_astro"];

export default function middleware(request: Request) {
	const url = new URL(request.url);
	const host = url.hostname;

	if (host.endsWith(`.${BASE_TENANT_HOST}`)) {
		const sub = host.slice(0, -`.${BASE_TENANT_HOST}`.length);

		if (sub && !RESERVED.has(sub)) {
			if (EXCLUDED_PATHS.some(path => url.pathname.startsWith(path))) {
				return next();
			}
			const target = new URL(
				`/org/${sub}${url.pathname}${url.search}`,
				url,
			);
			return rewrite(target);
		}
	}

	return next();
}
