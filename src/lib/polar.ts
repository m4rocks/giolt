import { POLAR_ACCESS_TOKEN, VERCEL_ENV } from "astro:env/server";
import { organizations, subscriptions } from "@/db/schema";
import { Polar } from "@polar-sh/sdk";
import type { APIContext } from "astro";
import { and, eq, sql } from "drizzle-orm";
import { db } from "./db";

export const polarServer =
	VERCEL_ENV === "production" ? "production" : "sandbox";

export const polar = new Polar({
	accessToken: POLAR_ACCESS_TOKEN,
	server: polarServer,
});

export async function countOrganizationsForUser(userId: string) {
	// count how many orgs are tied to the current user's active subscription
	const result = await db
		.select({
			orgCount: sql<number>`count(${organizations.id})`,
		})
		.from(organizations)
		.innerJoin(
			subscriptions,
			eq(organizations.subscriptionId, subscriptions.id),
		)
		.where(
			and(
				eq(subscriptions.userId, userId as string),
				eq(subscriptions.status, "active"),
			),
		);

	return result[0]?.orgCount ?? 0;
}
