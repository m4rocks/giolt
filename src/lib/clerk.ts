import { organizations } from "@/db/schema";
import type { APIContext } from "astro";
import { and, eq, isNotNull } from "drizzle-orm";

interface ProtectRouteProps {
	needsAccount?: boolean;
	needsSubscription?: boolean;
	needsSelectedOrg?: boolean;
}

export const protectRoute = async (
	ctx: APIContext,
	props?: ProtectRouteProps,
) => {
	const {
		needsAccount = true,
		needsSubscription = true,
		needsSelectedOrg = true,
	} = props ?? {};

	const { userId, orgId, redirectToSignIn } = ctx.locals.auth();
	const db = ctx.locals.db;

	if (needsAccount && !userId) {
		return redirectToSignIn();
	}

	if (needsSelectedOrg && !orgId) {
		return ctx.redirect("/select");
	}

	if (needsSubscription) {
		const sub = await db
			.select({
				active: eq(organizations.subscriptionStatus, "active"),
			})
			.from(organizations)
			.where(
				and(
					eq(organizations.id, orgId as string),
					eq(organizations.subscriptionStatus, "active"),
					isNotNull(organizations.subscriptionId),
				),
			)
			.get();

		if (!sub) {
			return ctx.redirect("/subscribe");
		}
	}
};
