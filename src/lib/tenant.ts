import { VERCEL_ENV } from "astro:env/server";
import { projects } from "@/db/schema";
import type { APIContext } from "astro";
import { and, eq } from "drizzle-orm";
import { getCookies } from "./cookie";
import { db } from "./db";

export const getTenantUrl = (slug: string) => {
	return VERCEL_ENV === "production"
		? `https://${slug}.giolt.org`
		: `http://${slug}.localhost:3000`;
};

export const getProjectAccessFromRequest = async (ctx: APIContext) => {
	const cookies = getCookies(ctx.request.headers);
	const projectId = cookies.giolt_project_id;
	const projectCode = cookies.giolt_project_code;

	if (!projectId || !projectCode) {
		return null;
	}

	const project = await db
		.select()
		.from(projects)
		.where(
			and(
				eq(projects.id, Number.parseInt(projectId)),
				eq(projects.code, projectCode),
			),
		)
		.get();

	if (!project) {
		return null;
	}

	return project.id;
};
