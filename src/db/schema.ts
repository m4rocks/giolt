import { THEMES } from "@/lib/data";
import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const organizations = sqliteTable("organizations", {
	id: text("id").primaryKey().unique(),
	name: text("name").notNull(),
	slug: text("slug").notNull(),
	logoUrl: text("logo_url"),
	mission: text("mission"),
	about: text("about"),
	contact: text("contact"),
	location: text("location"),
	theme: text("theme", { enum: THEMES }).notNull().default("light"),
	volunteerCodeOfConduct: text("volunteer_code_of_conduct"),
	teamSectionEnabled: int("team_section_enabled", { mode: "boolean" })
		.notNull()
		.default(true),
	hideGioltBranding: int("hide_giolt_branding", { mode: "boolean" })
		.notNull()
		.default(false),
	enabled: int("enabled", { mode: "boolean" }).notNull().default(false),
});

export type SelectOrganizations = typeof organizations.$inferSelect;
export type InsertOrganizations = typeof organizations.$inferInsert;

export const blogPosts = sqliteTable("blog_posts", {
	id: int("id").primaryKey().unique(),
	title: text("title").notNull(),
	description: text("description").notNull().default(""),
	content: text("content").notNull().default(""),
	writerId: text("writer_id"),
	readingTime: int("reading_time").notNull().default(1),
	date: int("date", { mode: "timestamp" })
		.notNull()
		.default(sql`(current_timestamp)`),
	draft: int("draft", { mode: "boolean" }).notNull().default(true),
	organizationId: text("organization_id")
		.notNull()
		.references(() => organizations.id),
});

export type SelectBlogPosts = typeof blogPosts.$inferSelect;
export type InsertBlogPosts = typeof blogPosts.$inferInsert;
