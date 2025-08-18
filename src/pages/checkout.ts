import {
	POLAR_ACCESS_TOKEN,
	POLAR_MONTHLY_PRODUCT,
	VERCEL_ENV,
} from "astro:env/server";
import { organizations, subscriptions } from "@/db/schema";
import { db } from "@/lib/db";
import { polar } from "@/lib/polar";
import type { User } from "@clerk/astro/server";
import type { APIRoute } from "astro";
import { and, eq } from "drizzle-orm";

export const GET: APIRoute = async (ctx) => {
	const { orgId, userId, orgSlug } = ctx.locals.auth();

	if (!userId) {
		return new Response("Unauthorized", { status: 401 });
	}

	const sub = await db
		.select()
		.from(subscriptions)
		.where(eq(subscriptions.userId, userId))
		.get();

	if (sub && sub?.status === "active") {
		return ctx.redirect("/dashboard");
	}

	const user = (await ctx.locals.currentUser()) as User;

	const checkout = await polar.checkouts.create({
		products: [POLAR_MONTHLY_PRODUCT],
		externalCustomerId: userId,
		allowDiscountCodes: false,
		customerName: user.fullName,
		customerEmail: user.primaryEmailAddress?.emailAddress,
		successUrl: `${ctx.url.origin}/dashboard`,
	});

	return ctx.redirect(checkout.url);
};
