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
	volunteerCodeOfConduct: text("volunteer_code_of_conduct"),
	hideGioltBranding: int("hide_giolt_branding", { mode: "boolean" }).notNull().default(false),
	enabled: int("enabled", { mode: "boolean" }).notNull().default(false)
});

export type SelectOrganizations = typeof organizations.$inferSelect;
export type InsertOrganizations = typeof organizations.$inferInsert;
