// @ts-check
import { defineConfig, envField } from "astro/config";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import clerk from "@clerk/astro";
import tailwindcss from "@tailwindcss/vite";
import { clerkTheme } from "./src/lib/clerk-theme";
import { tenantRouteFix } from "./src/lib/tenant-integration";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
	output: "server",

	integrations: [
		tenantRouteFix,
		clerk({
			appearance: clerkTheme,
		}),
		react(),
		sitemap(),
	],
	experimental: {
		chromeDevtoolsWorkspace: true,
	},

	site:
		process.env.VERCEL_ENV === "production"
			? "https://giolt.com"
			: "http://localhost:3000",

	adapter: cloudflare({
		platformProxy: {
			enabled: true,
			configPath: "./wrangler.json"
		},
	}),
	security: {
		checkOrigin: false,
	},

	env: {
		schema: {
			TURSO_DATABASE_URL: envField.string({
				access: "secret",
				context: "server",
				optional: false,
				default: "http://127.0.1:8080",
			}),
			TURSO_AUTH_TOKEN: envField.string({
				access: "secret",
				context: "server",
				optional: true,
				default: "",
			}),
			CLERK_WEBHOOK_SIGNING_SECRET: envField.string({
				access: "secret",
				context: "server",
				optional: false,
			}),
			POLAR_ACCESS_TOKEN: envField.string({
				access: "secret",
				context: "server",
				optional: false,
			}),
			POLAR_WEBHOOK_SECRET: envField.string({
				access: "secret",
				context: "server",
				optional: false,
			}),
			POLAR_MONTHLY_PRODUCT: envField.string({
				access: "secret",
				context: "server",
				optional: false,
			}),
			POLAR_YEARLY_PRODUCT: envField.string({
				access: "secret",
				context: "server",
				optional: false,
			}),
		},
		validateSecrets: true,
	},

	server: {
		port: 3000,
	},

	vite: {
		server: {
			allowedHosts: ["saved-macaque-eagerly.ngrok-free.app"]
		},
		plugins: [tailwindcss()],
	},
});
