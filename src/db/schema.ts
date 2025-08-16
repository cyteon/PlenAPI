import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const dataRefreshTimes = pgTable("data_refresh_times", {
    id: serial("id").primaryKey(),
    data: text("data").notNull(),
    updateAt: timestamp("update_at", { withTimezone: true }).notNull(),
});