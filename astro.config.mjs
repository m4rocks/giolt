// @ts-check
import { defineConfig } from "astro/config";

import clerk from "@clerk/astro";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
	output: "server",
	integrations: [clerk(), react(), sitemap()],
	adapter: vercel({
		webAnalytics: {
			enabled: true
		},
		isr: false
	}),
	server: {
		port: 3000
	},

	vite: {
		plugins: [tailwindcss()],
	},
});
