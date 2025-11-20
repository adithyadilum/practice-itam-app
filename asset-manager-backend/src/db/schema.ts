import { pgTable, serial, varchar, integer, timestamp } from 'drizzle-orm/pg-core';

export const assets = pgTable("assets", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    category: varchar("category", { length: 100 }),
    quantity: integer("quantity").default(1),
});