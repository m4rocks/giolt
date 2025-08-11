import { int, sqliteTable } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("organizations", {
	id: int().primaryKey().unique()
})
