import type { APIRoute } from "astro";

export const GET: APIRoute = (ctx) => {
	return ctx.redirect("/");
};
