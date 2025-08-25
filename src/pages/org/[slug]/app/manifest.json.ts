import { organizations } from "@/db/schema";
import { THEME_BASE_COLORS } from "@/lib/data";
import type { APIRoute } from "astro";
import { inferRemoteSize } from "astro:assets";
import { eq } from "drizzle-orm";
import type { WebAppManifest } from "web-app-manifest";

export const GET: APIRoute = async (ctx) => {
	const db = ctx.locals.db;
	const code = ctx.url.searchParams.get("code");
	if (!ctx.params.slug) {
		return new Response("Invalid slug", { status: 400 });
	}

	const org = await db
		.select()
		.from(organizations)
		.where(eq(organizations.slug, ctx.params.slug))
		.get();

	if (!org) {
		return new Response("Organization not found", { status: 404 });
	}

	const logoSize = await inferRemoteSize(org.logoUrl || "");

	const manifest: WebAppManifest = {
		name: `${org.name} App`,
		scope: "/app",
		start_url: `/app?${code ? `code=${code},` : ""}utm_source=homescreen`,
		background_color: THEME_BASE_COLORS[org.theme],
		theme_color: THEME_BASE_COLORS[org.theme],
		display: "standalone",
		orientation: "portrait",
		icons: org.logoUrl
			? [
					{
						src: org.logoUrl,
						sizes: `${logoSize.width}x${logoSize.height}`,
						type: "image/png",
						purpose: "any",
					},
				]
			: undefined,
	};

	return new Response(JSON.stringify(manifest), {
		headers: {
			"Content-Type": "application/manifest+json",
		},
	});
};
