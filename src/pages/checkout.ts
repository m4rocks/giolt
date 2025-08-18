import { POLAR_MONTHLY_PRODUCT, POLAR_YEARLY_PRODUCT } from "astro:env/server";
import { organizations } from "@/db/schema";
import { db } from "@/lib/db";
import { polar } from "@/lib/polar";
import type { User } from "@clerk/astro/server";
import type { APIRoute } from "astro";
import { and, eq } from "drizzle-orm";

export const GET: APIRoute = async (ctx) => {
	const { orgId, userId } = ctx.locals.auth();
	const type = ctx.url.searchParams.get("type") as
		| "monthly"
		| "yearly"
		| null;

	if (!userId || !orgId) {
		return new Response("Unauthorized", { status: 401 });
	}

	if (!type || !["monthly", "yearly"].includes(type)) {
		return new Response("Invalid type", { status: 400 });
	}

	const org = await db
		.select()
		.from(organizations)
		.where(and(eq(organizations.id, orgId)))
		.get();

	if (org && org.subscriptionStatus === "active") {
		return ctx.redirect("/dashboard");
	}

	const user = (await ctx.locals.currentUser()) as User;

	const checkout = await polar.checkouts.create({
		products: [
			type === "monthly" ? POLAR_MONTHLY_PRODUCT : POLAR_YEARLY_PRODUCT,
		],
		externalCustomerId: userId,
		allowDiscountCodes: false,
		customerName: user.fullName,
		customerEmail: user.primaryEmailAddress?.emailAddress,
		successUrl: `${ctx.url.origin}/dashboard`,
		metadata: {
			orgId,
		},
	});

	return ctx.redirect(checkout.url);
};
