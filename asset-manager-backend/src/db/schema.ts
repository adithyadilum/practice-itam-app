import { pgTable, serial, text, integer, uniqueIndex, index } from "drizzle-orm/pg-core";

export const assets = pgTable("assets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category"),
  quantity: integer("quantity").default(1),
  // New fields
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