import Elysia, { t } from "elysia";
import db from "../../../db";
import { aircraftRegistrations } from "../../../db/schema";
import { ilike, or } from "drizzle-orm";


export default new Elysia({ prefix: "/aircraft" })
    .get(
        "/reg/:id",
        async ({ params, status }) => {
            const { id } = params;

            if (!id) {
                return status(400, { error: "You must provide a 'id' parameter" });
            }

            const aircraft = await getAircraftByReg(id);

            return aircraft || status(404, { error: "Aircraft not found" });
        },
        {
            detail: { tags: ["Aircraft"], description: "Get aircraft by registration or Mode S" },
            params: t.Object({
                id: t.String({ description: "The registration or Mode S address of the aircraft" })
            }),
            response: {
                200: t.Object({
                    type: t.String({ description: "The aircraft type" }),
                    icao_type: t.String({ description: "The ICAO type of the aircraft" }),
                    manufacturer: t.String({ description: "The manufacturer of the aircraft" }),
                    mode_s: t.String({ description: "The mode_s address of the aircraft" }),
                    registration: t.String({ description: "The registration of the aircraft" }),
                    registered_owner_country_iso_name: t.Nullable(t.String({ description: "The ISO name of the registered owner country" })),
                    registered_owner_country_name: t.Nullable(t.String({ description: "The name of the registered owner country" })),
                    registered_owner_operator_flag_code: t.Nullable(t.String({ description: "The operator flag code of the registered owner" })),
                    registered_owner: t.Nullable(t.String({ description: "The registered owner of the aircraft" })),
                    url_photo: t.Nullable(t.String({ description: "The URL of a photo of the aircraft" })),
                    url_photo_thumbnail: t.Nullable(t.String({ description: "The URL of a thumbnail photo of the aircraft" }))
                }),
                400: t.Object({
                    error: t.String({ description: "Error message" })
                }),
                404: t.Object({
                    error: t.String({ description: "Aircraft not found" })
                })
            }
        }
    )

export async function getAircraftByReg(id: string) {
    let aircraft = await db.select().from(aircraftRegistrations).where(
        or(
            ilike(aircraftRegistrations.registration, id),
            ilike(aircraftRegistrations.mode_s, id)
        )
    ).execute();

    if (aircraft.length === 0) {
        const res = await fetch(`https://api.adsbdb.com/v0/aircraft/${id}`)

        if (!res.ok) {
            return null;
        }

        const data = await res.json();
        if (!data?.response?.aircraft) {
            return null;
        }

        aircraft[0] = data.response.aircraft;
        await db.insert(aircraftRegistrations).values(aircraft).onConflictDoNothing().execute();
    }

    return aircraft[0];
}