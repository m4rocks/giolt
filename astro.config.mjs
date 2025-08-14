// @ts-check
import { defineConfig, envField } from "astro/config";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import clerk from "@clerk/astro";
import tailwindcss from "@tailwindcss/vite";
import { clerkTheme } from "./src/lib/clerk";

// https://astro.build/config
export default defineConfig({
	output: "server",
	integrations: [
		clerk({
			appearance: clerkTheme,
		}),
		react(),
		sitemap(),
	],
	site: "https://giolt.com",
	adapter: vercel({
		webAnalytics: {
			enabled: true,
		},
		isr: false,
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
			VERCEL_ENV: envField.enum({
				values: ["development", "preview", "production"],
				default: "development",
				access: "secret",
				context: "server",
			}),
		},
	},
	server: {
		port: 3000,
	},

	vite: {
		plugins: [tailwindcss()],
	},
});
