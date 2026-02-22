import { 
  pgTable, 
  serial, 
  varchar, 
  text, 
  integer, 
  timestamp, 
  jsonb, 
  uniqueIndex, 
  index 
} from "drizzle-orm/pg-core";

export const assets = pgTable("assets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category"),
  quantity: integer("quantity").default(1),
  // New fields from main
  serialNumber: text("serial_number"),
  assetTag: text("asset_tag"),
}, (table) => {
  return {
    // Unique index: Prevents duplicates and makes search instant
    serialNumIdx: uniqueIndex("serial_number_idx").on(table.serialNumber),
    assetTagIdx: uniqueIndex("asset_tag_idx").on(table.assetTag),
    nameIdx: index("name_idx").on(table.name),
  };
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  assetId: integer("asset_id").references(() => assets.id, { onDelete: "cascade" }).notNull(),
  action: varchar("action", { length: 20 }).notNull(),
  payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});