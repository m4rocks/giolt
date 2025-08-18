import { CLERK_WEBHOOK_SIGNING_SECRET } from "astro:env/server";
import { organizations } from "@/db/schema";
import { db } from "@/lib/db";
import { polar } from "@/lib/polar";
import { verifyWebhook } from "@clerk/astro/webhooks";
import type {
	DeletedObjectJSON,
	OrganizationJSON,
	UserJSON,
} from "@clerk/backend";
import type { APIContext, APIRoute } from "astro";
import { eq } from "drizzle-orm";

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
				await deleteOrganization(ctx, evt.data);
				break;
		}

		return new Response("OK", { status: 200 });
	} catch (err) {
		console.error("Error verifying webhook", err);
		return new Response("Error verifying webhook", { status: 400 });
	}
};

async function createUser(data: UserJSON) {
	await polar.customers.create({
		email: data.email_addresses[0].email_address,
		externalId: data.id,
	});
}

async function createOrganization(data: OrganizationJSON) {
	await db.insert(organizations).values({
		id: data.id,
		logoUrl: data.image_url,
		name: data.name,
		slug: data.slug,
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

async function deleteOrganization(ctx: APIContext, data: DeletedObjectJSON) {
	const org = await db
		.select()
		.from(organizations)
		.where(eq(organizations.id, data.id as string))
		.get();

	if (org?.subscriptionId) {
		await polar.subscriptions.revoke({
			id: org.subscriptionId,
		});
	}

	await db
		.delete(organizations)
		.where(eq(organizations.id, data.id as string));
}
