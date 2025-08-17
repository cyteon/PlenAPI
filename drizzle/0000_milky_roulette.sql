CREATE TABLE "aircraft_registrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"icao_type" text NOT NULL,
	"manufacturer" text NOT NULL,
	"mode_s" text NOT NULL,
	"registration" text NOT NULL,
	"registered_owner_country_iso_name" text NOT NULL,
	"registered_owner_country_name" text NOT NULL,
	"registered_owner_operator_flag_code" text NOT NULL,
	"registered_owner" text NOT NULL,
	"url_photo" text,
	"url_photo_thumbnail" text
);
--> statement-breakpoint
CREATE TABLE "airlines" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"alias" text,
	"iata" text,
	"icao" text,
	"callsign" text NOT NULL,
	"country" text NOT NULL,
	"active" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "airports" (
	"id" serial PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"latitude" text NOT NULL,
	"longitude" text NOT NULL,
	"elevation" text NOT NULL,
	"continent" text NOT NULL,
	"country" text NOT NULL,
	"region" text NOT NULL,
	"municipality" text NOT NULL,
	"scheduled_service" text NOT NULL,
	"icao_code" text,
	"iata_code" text,
	"gps_code" text,
	"local_code" text,
	"home_link" text,
	"wikipedia_link" text
);
