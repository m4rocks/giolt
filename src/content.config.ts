import { defineCollection } from "astro:content";
import { z } from "astro:schema";
import { glob } from "astro/loaders";

const updates = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/updates" }),
	schema: z.object({
		title: z.string(),
		date: z.date(),
	}),
});

export const collections = {
	updates,
};
