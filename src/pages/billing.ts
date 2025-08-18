import { protectRoute } from "@/lib/clerk";
import { polar } from "@/lib/polar";
import type { APIRoute } from "astro";

export const GET: APIRoute = async (ctx) => {
	const { userId } = ctx.locals.auth();
	const res = await protectRoute(ctx, {
		needsAccount: true,
		needsSubscription: false,
		needsSelectedOrg: false,
	});
	if (res) return res;

	const customerPortal = await polar.customerSessions.create({
		externalCustomerId: userId as string,
	});

	return ctx.redirect(customerPortal.customerPortalUrl);
};
