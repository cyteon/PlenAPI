import { boolean, doublePrecision, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

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


// every plane currently in the sky, updated every 30 seconds from opensky network
export  const flights = pgTable("flights", {
    id: serial("id").primaryKey(),
    icao24: text("icao24").notNull(),
    callsign: text("callsign"),
    origin_country: text("origin_country").notNull(),
    time_position: timestamp("time_position"),
    last_contact: timestamp("last_contact"),
    longitude: doublePrecision("longitude"),
    latitude: doublePrecision("latitude"),
    baro_altitude: doublePrecision("baro_altitude"),
    on_ground: boolean("on_ground").notNull(),
    velocity: doublePrecision("velocity"),
    true_track: doublePrecision("true_track"),
    vertical_rate: doublePrecision("vertical_rate"),
    sensors: text("sensors"),
    geo_altitude: doublePrecision("geo_altitude"),
    squawk: text("squawk"),
    spi: boolean("spi").notNull(),
    position_source: integer("position_source").notNull(),
    category: integer("category"),
});