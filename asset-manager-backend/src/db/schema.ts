import { pgTable, serial, varchar, integer, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const assets = pgTable("assets", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    category: varchar("category", { length: 100 }),
    quantity: integer("quantity").default(1),
});

export const auditLogs = pgTable("audit_logs", {
    id: serial("id").primaryKey(),
    assetId: integer("asset_id").references(() => assets.id, { onDelete: "cascade" }).notNull(),
    action: varchar("action", { length: 20 }).notNull(),
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});