import { boolean, doublePrecision, foreignKey, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

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

export const callsigns = pgTable("callsigns", {
    id: serial("id").primaryKey(),
    callsign: text("callsign").notNull(),
    callsign_icao: text("callsign_icao"),
    callsign_iata: text("callsign_iata"),
    
    airline_name: text("airline_name"),
    airline_icao: text("airline_icao"),
    airline_iata: text("airline_iata"),
    airline_country: text("airline_country"),
    airline_country_iso: text("airline_country_iso"),
    airline_callsign: text("airline_callsign"),

    origin_country_iso_name: text("origin_country_iso_name"),
    origin_country_name: text("origin_country_name"),
    origin_elevation: integer("origin_elevation"),
    origin_iata_code: text("origin_iata_code"),
    origin_icao_code: text("origin_icao_code"),
    origin_latitude: doublePrecision("origin_latitude"),
    origin_longitude: doublePrecision("origin_longitude"),
    origin_municipality: text("origin_municipality"),
    origin_name: text("origin_name"),
    
    destination_country_iso_name: text("destination_country_iso_name"),
    destination_country_name: text("destination_country_name"),
    destination_elevation: integer("destination_elevation"),
    destination_iata_code: text("destination_iata_code"),
    destination_icao_code: text("destination_icao_code"),
    destination_latitude: doublePrecision("destination_latitude"),
    destination_longitude: doublePrecision("destination_longitude"),
    destination_municipality: text("destination_municipality"),
    destination_name: text("destination_name")
});

export const aircraft = pgTable("aircraft", {
    icao24: text("icao24").primaryKey(),
    timestamp: timestamp("timestamp"),
    acars: boolean("acars"),
    adsb: boolean("adsb"),
    built: timestamp("built"),
    categoryDescription: text("categoryDescription"),
    country: text("country"),
    engines: text("engines"),
    firstFlightDate: text("firstFlightDate"),
    firstSeen: timestamp("firstSeen"),
    icaoAircraftClass: text("icaoAircraftClass"),
    manufacturerIcao: text("manufacturerIcao"),
    manufacturerName: text("manufacturerName"),
    model: text("model"),
    registered: timestamp("registered"),
    registration: text("registration"),
    serialNumber: text("serialNumber"),
});

// every plane currently in the sky, updated every 30 seconds from opensky network
export const flights = pgTable("flights", {
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

// this is for my app :)
export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const tokens = pgTable("tokens", {
    id: serial("id").primaryKey(),
    user_id: integer("user_id").notNull(),
    token: text("token").notNull(),
}, (table) => ({
    userForeignKey: foreignKey({ name: "user_fk", columns: [table.user_id], foreignColumns: [users.id] }),
}));