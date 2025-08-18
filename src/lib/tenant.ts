import { VERCEL_ENV } from "astro:env/client";

export const getTenantUrl = (slug: string) => {
	return VERCEL_ENV
		? `https://${slug}.giolt.org`
		: `http://${slug}.localhost:3000`;
};
