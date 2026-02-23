import { 
  pgTable, 
  serial, 
  varchar, 
  integer, 
  decimal, 
  date,
  timestamp 
} from 'drizzle-orm/pg-core';

export const assets = pgTable("assets", {
    id: serial("id").primaryKey(),

    name: varchar("name", { length: 255 }).notNull(),

    category: varchar("category", { length: 100 }),

    quantity: integer("quantity").default(1),

    purchaseCost: decimal("purchase_cost", { precision: 10, scale: 2 }),

    purchaseDate: date("purchase_date"),

    usefulLifeYears: integer("useful_life_years").default(5),

    salvageValue: decimal("salvage_value", { precision: 10, scale: 2 }).default("0"),

    createdAt: timestamp("created_at").defaultNow()
});