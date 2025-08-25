import { organizations, projects } from "@/db/schema";
import { setCookie } from "@/lib/cookie";
import { getTenantUrl } from "@/lib/tenant";
import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";

export const GET: APIRoute = async (ctx) => {
	const db = ctx.locals.db;
	const code = ctx.url.searchParams.get("code");
	const slug = ctx.params.slug;

	if (!slug) {
		return ctx.redirect("https://giolt.com");
	}

	if (!code) {
		return ctx.redirect(getTenantUrl(slug));
	}

	const row = await db
		.select()
		.from(projects)
		.innerJoin(organizations, eq(projects.organizationId, organizations.id))
		.limit(1)
		.get();

	const project = row?.projects;
	const org = row?.organizations;

	if (!project || !org) {
		return ctx.redirect(getTenantUrl(slug));
	}

	// Prepare cookies
	const maxAge = 30 * 24 * 60 * 60; // 30 days
	const secure = ctx.url.protocol === "https:";
	const redirectTo = `${getTenantUrl(slug)}/app`;
	const headers = new Headers();
	headers.set("Location", redirectTo);

	setCookie(headers, {
		name: "giolt_project_code",
		value: String(code),
		maxAge,
		path: "/",
		sameSite: "Lax",
		secure,
		httpOnly: true,
	});

	setCookie(headers, {
		name: "giolt_project_id",
		value: String(project.id),
		maxAge,
		path: "/",
		sameSite: "Lax",
		secure,
		httpOnly: true,
	});

	return new Response(null, {
		status: 302,
		headers,
	});
};
