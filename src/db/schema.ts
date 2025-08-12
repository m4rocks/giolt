import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("organizations", {
	id: int().primaryKey().unique(),
	clerkOrganizationId: text().unique().notNull()
})
