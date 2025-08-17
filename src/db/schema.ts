import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const airlines = pgTable("airlines", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    alias: text("alias"),
    iata: text("iata"),
    icao: text("icao"),
    callsign: text("callsign").notNull(),
    country: text("country").notNull(),
    active: text("active").notNull(),
});

export const airports = pgTable("airports", {
    id: serial("id").primaryKey(),
    identifier: text("identifier").notNull(),
    type: text("type").notNull(),
    name: text("name").notNull(),
    latitude: text("latitude").notNull(),
    longitude: text("longitude").notNull(),
    elevation: text("elevation").notNull(),
    continent: text("continent").notNull(),
    country: text("country").notNull(),
    region: text("region").notNull(),
    municipality: text("municipality").notNull(),
    scheduled_service: text("scheduled_service").notNull(),
    icao_code: text("icao_code"),
    iata_code: text("iata_code"),
    gps_code: text("gps_code"),
    local_code: text("local_code"),
    home_link: text("home_link"),
    wikipedia_link: text("wikipedia_link"),
});