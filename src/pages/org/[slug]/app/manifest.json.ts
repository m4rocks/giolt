import { organizations } from "@/db/schema";
import { db } from "@/lib/db";
import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";
import type { WebAppManifest } from "web-app-manifest";

export const GET: APIRoute = async (ctx) => {
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

	const manifest: WebAppManifest = {
		name: `${org.name} App`,
		scope: "/app",
		start_url: "/app",
		display: "standalone",
		orientation: "portrait",
		icons: org.logoUrl
			? [
					{
						src: org.logoUrl,
						sizes: "460x460",
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
