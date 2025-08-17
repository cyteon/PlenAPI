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

export const aircraftRegistrations = pgTable("aircraft_registrations", {
    id: serial("id").primaryKey(),
    type: text("type").notNull(),
    icao_type: text("icao_type").notNull(),
    manufacturer: text("manufacturer").notNull(),
    mode_s: text("mode_s").notNull(),
    registration: text("registration").notNull(),
    registered_owner_country_iso_name: text("registered_owner_country_iso_name"),
    registered_owner_country_name: text("registered_owner_country_name"),
    registered_owner_operator_flag_code: text("registered_owner_operator_flag_code"),
    registered_owner: text("registered_owner"),
    url_photo: text("url_photo"),
    url_photo_thumbnail: text("url_photo_thumbnail"),
});