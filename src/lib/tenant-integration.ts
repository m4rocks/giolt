import type { AstroIntegration } from "astro";

export const tenantRouteFix: AstroIntegration = {
	name: "giolt-tenant-route-fix",
	hooks: {
		"astro:config:setup": ({ injectRoute }) => {
			injectRoute({
				pattern: "/blog/[...all]",
				entrypoint: "./src/pages/api/redirect.ts",
			});
			injectRoute({
				pattern: "/app/[...all]",
				entrypoint: "./src/pages/api/redirect.ts",
			});
		}
	}
}
