import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const issues = sqliteTable("issues", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title", { length: 64 }).notNull(),
  description: text("description", { length: 500 }).notNull(),
  priority: text("priority", {
    enum: ["low", "medium", "high"],
  }).notNull(),
  status: text("status", {
    enum: ["pending", "in_progress", "completed", "postponed"],
  })
    .notNull()
    .default("pending"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch('subsec') * 1000)`),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch('subsec') * 1000)`)
    .$onUpdate(() => new Date()),
});

export type Issue = typeof issues.$inferSelect;
export type IssueInsertValue = typeof issues.$inferInsert;
