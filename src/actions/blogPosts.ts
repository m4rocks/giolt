import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { blogPosts } from "@/db/schema";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";

export const blog = {
	create: defineAction({
		accept: "form",
		input: z.object({
			title: z.string(),
			description: z.string(),
		}),
		handler: async (input, ctx) => {
			const { orgId, userId } = ctx.locals.auth();

			if (!userId) {
				throw new ActionError({
					code: "UNAUTHORIZED",
					message: "User is not authenticated",
				});
			}

			if (!orgId) {
				throw new ActionError({
					code: "BAD_REQUEST",
					message: "Organization ID is not selected",
				});
			}

			try {
				return await db
					.insert(blogPosts)
					.values({
						title: input.title,
						description: input.description,
						organizationId: orgId,
					})
					.returning()
					.then((data) => data[0]);
			} catch (err) {
				throw new ActionError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to create blog post",
				});
			}
		},
	}),
	update: defineAction({
		accept: "form",
		input: z.object({
			id: z.string(),
			title: z.string(),
			description: z.string(),
			content: z.string(),
			draft: z.enum(["on"]).optional(),
		}),
		handler: async (input, ctx) => {
			const { orgId, userId } = ctx.locals.auth();

			if (!userId) {
				throw new ActionError({
					code: "UNAUTHORIZED",
					message: "User is not authenticated",
				});
			}

			if (!orgId) {
				throw new ActionError({
					code: "BAD_REQUEST",
					message: "Organization ID is not selected",
				});
			}

			try {
				await db
					.update(blogPosts)
					.set({
						title: input.title,
						description: input.description,
						content: input.content,
						draft: input.draft === "on",
					})
					.where(
						and(
							eq(blogPosts.id, Number.parseInt(input.id)),
							eq(blogPosts.organizationId, orgId),
						),
					);
			} catch (err) {
				throw new ActionError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to update blog post",
				});
			}
		},
	}),
};
