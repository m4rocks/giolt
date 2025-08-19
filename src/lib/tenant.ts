import { VERCEL_ENV } from "astro:env/server";

export const getTenantUrl = (slug: string) => {
	return VERCEL_ENV === "production"
		? `https://${slug}.giolt.org`
		: `http://${slug}.localhost:3000`;
};
