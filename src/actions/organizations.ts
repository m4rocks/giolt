import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { organizations } from "@/db/schema";
import { THEMES } from "@/lib/data";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

export const orgs = {
	update: defineAction({
		input: z.object({
			orgId: z.string(),
			about: z.string().optional(),
			mission: z.string().optional(),
			location: z.string().optional(),
			theme: z.enum(THEMES),
			teamSectionEnabled: z.boolean(),
		}),
		handler: async (input, ctx) => {
			const { orgId, userId } = ctx.locals.auth();

			if (!userId) {
				throw new ActionError({
					code: "UNAUTHORIZED",
					message: "User is not authenticated",
				});
			}

			if (!orgId || input.orgId !== orgId) {
				throw new ActionError({
					code: "BAD_REQUEST",
					message: "Organization ID is required or is not selected",
				});
			}

			try {
				await db
					.update(organizations)
					.set({
						mission: input.mission,
						about: input.about,
						location: input.location,
						theme: input.theme,
						teamSectionEnabled: input.teamSectionEnabled,
					})
					.where(eq(organizations.id, orgId));
			} catch (err) {
				throw new ActionError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to update organization details",
				});
			}
		},
	}),
};
