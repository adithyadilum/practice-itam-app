import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  decimal,
  date,
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
  
  // Fields from main
  serialNumber: text("serial_number"),
  assetTag: text("asset_tag"),
  
  // Financial fields from feature/depreciation-logic
  purchaseCost: decimal("purchase_cost", { precision: 10, scale: 2 }),
  purchaseDate: date("purchase_date"),
  usefulLifeYears: integer("useful_life_years").default(5),
  salvageValue: decimal("salvage_value", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow()
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
  assetId: integer("asset_id").notNull(),
  action: varchar("action", { length: 20 }).notNull(),
  payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});