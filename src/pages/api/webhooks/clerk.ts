import { CLERK_WEBHOOK_SIGNING_SECRET } from "astro:env/server";
import { organizations, subscriptions } from "@/db/schema";
import { db } from "@/lib/db";
import { countOrganizationsForUser, polar } from "@/lib/polar";
import { verifyWebhook } from "@clerk/astro/webhooks";
import type {
	DeletedObjectJSON,
	OrganizationJSON,
	UserJSON,
} from "@clerk/backend";
import type { APIContext, APIRoute } from "astro";
import { and, eq } from "drizzle-orm";

export const POST: APIRoute = async (ctx) => {
	try {
		const evt = await verifyWebhook(ctx.request, {
			signingSecret: CLERK_WEBHOOK_SIGNING_SECRET,
		});

		switch (evt.type) {
			case "user.created":
				await createUser(evt.data);
				break;
			case "organization.created":
				await createOrganization(evt.data);
				break;
			case "organization.updated":
				await updateOrganization(evt.data);
				break;
			case "organization.deleted":
				await deleteOrganization(evt.data);
				break;
		}

		return new Response("OK", { status: 200 });
	} catch (err) {
		console.error("Error verifying webhook", err);
		return new Response("Error verifying webhook", { status: 400 });
	}
};

async function createUser(data: UserJSON) {
	await db
		.insert(subscriptions)
		.values({
			userId: data.id,
			status: "inactive",
		})
		.onConflictDoNothing();
}

async function createOrganization(data: OrganizationJSON) {
	const subscription = await db
		.select()
		.from(subscriptions)
		.where(eq(subscriptions.userId, data.created_by as string))
		.get();

	if (!subscription) {
		throw new Error("Subscription not found");
	}

	await db
		.insert(organizations)
		.values({
			id: data.id,
			logoUrl: data.image_url,
			name: data.name,
			slug: data.slug,
			subscriptionId: subscription.id,
		})
		.onConflictDoNothing();

	const count = await countOrganizationsForUser(data.created_by as string);

	await polar.events.ingest({
		events: [
			{
				name: "org_count",
				externalCustomerId: data.created_by as string,
				metadata: {
					current_count: count,
				},
			},
		],
	});
}

async function updateOrganization(data: OrganizationJSON) {
	await db
		.insert(organizations)
		.values({
			id: data.id,
			logoUrl: data.image_url,
			name: data.name,
			slug: data.slug,
		})
		.onConflictDoUpdate({
			target: organizations.id,
			set: {
				id: data.id,
				logoUrl: data.image_url,
				name: data.name,
				slug: data.slug,
			},
		});
}

async function deleteOrganization(data: DeletedObjectJSON) {
	await db
		.delete(organizations)
		.where(eq(organizations.id, data.id as string));
}
