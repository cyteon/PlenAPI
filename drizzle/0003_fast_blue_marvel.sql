CREATE TABLE "aircraft" (
	"icao24" text PRIMARY KEY NOT NULL,
	"timestamp" timestamp NOT NULL,
	"acars" boolean,
	"adsb" boolean,
	"built" timestamp,
	"categoryDescription" text,
	"country" text,
	"engines" text,
	"firstFlightDate" text,
	"firstSeen" timestamp,
	"icaoAircraftClass" text,
	"manufacturerIcao" text,
	"manufacturerName" text,
	"model" text,
	"registered" timestamp,
	"registration" text,
	"serialNumber" text
);
--> statement-breakpoint
CREATE TABLE "callsigns" (
	"id" serial PRIMARY KEY NOT NULL,
	"callsign" text NOT NULL,
	"callsign_icao" text,
	"callsign_iata" text,
	"airline_name" text,
	"airline_icao" text,
	"airline_iata" text,
	"airline_country" text,
	"airline_country_iso" text,
	"airline_callsign" text,
	"origin_country_iso_name" text,
	"origin_country_name" text,
	"origin_elevation" integer,
	"origin_iata_code" text,
	"origin_icao_code" text,
	"origin_latitude" double precision,
	"origin_longitude" double precision,
	"origin_municipality" text,
	"origin_name" text,
	"destination_country_iso_name" text,
	"destination_country_name" text,
	"destination_elevation" integer,
	"destination_iata_code" text,
	"destination_icao_code" text,
	"destination_latitude" double precision,
	"destination_longitude" double precision,
	"destination_municipality" text,
	"destination_name" text
);
--> statement-breakpoint
CREATE TABLE "flights" (
	"id" serial PRIMARY KEY NOT NULL,
	"icao24" text NOT NULL,
	"callsign" text,
	"origin_country" text NOT NULL,
	"time_position" timestamp,
	"last_contact" timestamp,
	"longitude" double precision,
	"latitude" double precision,
	"baro_altitude" double precision,
	"on_ground" boolean NOT NULL,
	"velocity" double precision,
	"true_track" double precision,
	"vertical_rate" double precision,
	"sensors" text,
	"geo_altitude" double precision,
	"squawk" text,
	"spi" boolean NOT NULL,
	"position_source" integer NOT NULL,
	"category" integer
);
--> statement-breakpoint
CREATE TABLE "tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"token" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "tokens" ADD CONSTRAINT "user_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;