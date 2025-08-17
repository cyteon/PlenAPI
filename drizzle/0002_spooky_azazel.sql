ALTER TABLE "aircraft_registrations" ALTER COLUMN "registered_owner_country_iso_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "aircraft_registrations" ALTER COLUMN "registered_owner_country_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "aircraft_registrations" ALTER COLUMN "registered_owner_operator_flag_code" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "aircraft_registrations" ALTER COLUMN "registered_owner" DROP NOT NULL;