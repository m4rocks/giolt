import { POLAR_WEBHOOK_SECRET } from "astro:env/server";
import { organizations, subscriptions } from "@/db/schema";
import { db } from "@/lib/db";
import { clerkClient } from "@clerk/astro/server";
import { Webhooks } from "@polar-sh/astro";
import type { APIContext, APIRoute } from "astro";
import { eq } from "drizzle-orm";

const subscriptionChange = async (
	payload: {
		data: {
			metadata: { [k: string]: string | number | boolean };
			customer: { externalId: string | null };
		};
	},
	ctx: APIContext,
	status: "active" | "inactive",
) => {
	const sub = await db
		.update(subscriptions)
		.set({
			status,
		})
		.where(
			eq(
				subscriptions.userId,
				payload.data.customer.externalId as string,
			),
		)
		.returning();

	await clerkClient(ctx).users.updateUser(
		payload.data.customer.externalId as string,
		{
			createOrganizationEnabled: status === "active",
			createOrganizationsLimit: 0,
		},
	);

	await db.update(organizations).set({
		subscriptionId: sub[0].id,
	});
};

export const POST: APIRoute = async (ctx) => {
	return Webhooks({
		webhookSecret: POLAR_WEBHOOK_SECRET,
		onSubscriptionActive: (payload) =>
			subscriptionChange(payload, ctx, "active"),
		onSubscriptionCanceled: (payload) =>
			subscriptionChange(payload, ctx, "inactive"),
		onSubscriptionUncanceled: (payload) =>
			subscriptionChange(payload, ctx, "active"),
		onSubscriptionRevoked: (payload) =>
			subscriptionChange(payload, ctx, "inactive"),
	})(ctx);
};
