import { defineAction } from "astro:actions";
import { z } from "astro:content";

export const projects = {
	update: defineAction({
		accept: "form",
		input: z.object({
			title: z.string(),
			description: z.string(),
			startDate: z.string(),
			endDate: z.string(),
			draft: z.enum(["on"]).optional(),
			location: z.string().optional(),
			siteAddress: z.string().optional(),
			rules: z.string().optional(),
			travelDetails: z.string().optional(),
			volunteerNumber: z.string().optional()
		}),
		handler: () => {}
	})
}
