import type { OrganizationJSON, DeletedObjectJSON } from "@clerk/backend";
import { verifyWebhook } from "@clerk/astro/webhooks";
import { CLERK_WEBHOOK_SIGNING_SECRET } from "astro:env/server";
import type { APIRoute } from "astro";
import { db } from "@/lib/db";
import { organizations } from "@/db/schema";
import { eq } from "drizzle-orm";

export const POST: APIRoute = async ({ request }) => {
	try {
		const evt = await verifyWebhook(request, {
			signingSecret: CLERK_WEBHOOK_SIGNING_SECRET
		})

		switch (evt.type) {
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
}

async function createOrganization(data: OrganizationJSON) {
	await db
		.insert(organizations)
		.values({
			id: data.id,
			logoUrl: data.image_url,
			name: data.name,
			slug: data.slug
		})
}

async function updateOrganization(data: OrganizationJSON) {
	await db
		.insert(organizations)
		.values({
			id: data.id,
			logoUrl: data.image_url,
			name: data.name,
			slug: data.slug
		})
		.onConflictDoUpdate({
			target: organizations.id,
			set: {
				id: data.id,
				logoUrl: data.image_url,
				name: data.name,
				slug: data.slug
			}
		});
}

async function deleteOrganization(data: DeletedObjectJSON) {
	await db
		.delete(organizations)
		.where(eq(organizations.id, data.id!))
}
