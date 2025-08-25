import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { organizations } from "@/db/schema";
import { THEMES } from "@/lib/data";
import { eq } from "drizzle-orm";

export const currentOrg = {
	update: defineAction({
		accept: "form",
		input: z.object({
			about: z.string().optional(),
			mission: z.string().optional(),
			location: z.string().optional(),
			email: z.string().email().optional(),
			theme: z.enum(THEMES),
			teamSectionEnabled: z.enum(["on"]).optional(),
			hideGioltBranding: z.enum(["on"]).optional(),
		}),
		handler: async (input, ctx) => {
			const { orgId, userId } = ctx.locals.auth();
			const db = ctx.locals.db;

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
					.update(organizations)
					.set({
						mission: input.mission,
						about: input.about,
						location: input.location,
						email: input.email,
						theme: input.theme,
						teamSectionEnabled: input.teamSectionEnabled === "on",
						hideGioltBranding: input.hideGioltBranding === "on",
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
