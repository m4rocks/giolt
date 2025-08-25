import { POLAR_WEBHOOK_SECRET } from "astro:env/server";
import { organizations } from "@/db/schema";
import { Webhooks } from "@polar-sh/astro";
import type { APIContext, APIRoute } from "astro";
import { eq } from "drizzle-orm";

const subscriptionChange = async (
	ctx: APIContext,
	payload: {
		data: {
			id: string;
			metadata: { [k: string]: string | number | boolean };
			customer: { externalId: string | null };
		};
	},
	status: "active" | "inactive",
) => {
	const db = ctx.locals.db;

	await db
		.update(organizations)
		.set({
			subscriptionStatus: status,
			subscriptionId: payload.data.id,
		})
		.where(eq(organizations.id, payload.data.metadata.orgId as string))
		.catch((error) => {
			console.error("Error updating organization:", error);
		});
};

export const POST: APIRoute = async (ctx) => {
	return Webhooks({
		webhookSecret: POLAR_WEBHOOK_SECRET,
		onSubscriptionActive: (payload) =>
			subscriptionChange(ctx, payload, "active"),
		onSubscriptionRevoked: (payload) =>
			subscriptionChange(ctx, payload, "inactive"),
	})(ctx);
};
