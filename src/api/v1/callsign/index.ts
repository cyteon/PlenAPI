import Elysia, { t } from "elysia";
import db from "../../../db";
import { callsigns } from "../../../db/schema";
import { ilike } from "drizzle-orm";


export default new Elysia({ prefix: "/callsign" })
    .get(
        "/:callsign",
        async ({ params, status }) => {
            const { callsign } = params;

            if (!callsign) {
                return status(400, { error: "You must provide a 'callsign' parameter" });
            }

            const data = await getCallsign(callsign);

            return data || status(404, { error: "Callsign not found" });
        },
        {
            detail: { tags: ["Callsigns"], description: "Get a callsign" },
            params: t.Object({
                callsign: t.String({ description: "The callsign" })
            }),
            response: {
                200: t.Object({
                    callsign: t.String({ description: "The callsign of the flight" }),
                    callsign_icao: t.Nullable(t.String({ description: "The ICAO code of the airline" })),
                    callsign_iata: t.Nullable(t.String({ description: "The IATA code of the airline" })),
                   
                    airline: t.Nullable(
                        t.Object({
                            name: t.String({ description: "The name of the airline" }),
                            icao: t.Nullable(t.String({ description: "The ICAO code of the airline" })),
                            iata: t.Nullable(t.String({ description: "The IATA code of the airline" })),
                            country: t.String({ description: "The country of the airline" }),
                            country_iso: t.String({ description: "The ISO code of the country" }),
                            callsign: t.Nullable(t.String({ description: "The callsign of the airline" })),
                        })
                    ),

                    origin: t.Nullable(
                        t.Object({
                            country_iso_name: t.String({ description: "The ISO name of the origin country" }),
                            country_name: t.String({ description: "The name of the origin country" }),
                            elevation: t.Nullable(t.Number({ description: "The elevation of the origin airport" })),
                            icao_code: t.Nullable(t.String({ description: "The ICAO code of the origin airport" })),
                            iata_code: t.Nullable(t.String({ description: "The IATA code of the origin airport" })),
                            longitude: t.Nullable(t.Number({ description: "The longitude of the origin airport" })),
                            latitude: t.Nullable(t.Number({ description: "The latitude of the origin airport" })),
                            municipality: t.Nullable(t.String({ description: "The municipality of the origin airport" })),
                            name: t.Nullable(t.String({ description: "The name of the origin airport" })),
                        })
                    ),

                    destination: t.Nullable(
                        t.Object({
                            country_iso_name: t.String({ description: "The ISO name of the destination country" }),
                            country_name: t.String({ description: "The name of the destination country" }),
                            elevation: t.Nullable(t.Number({ description: "The elevation of the destination airport" })),
                            icao_code: t.Nullable(t.String({ description: "The ICAO code of the destination airport" })),
                            iata_code: t.Nullable(t.String({ description: "The IATA code of the destination airport" })),
                            longitude: t.Nullable(t.Number({ description: "The longitude of the destination airport" })),
                            latitude: t.Nullable(t.Number({ description: "The latitude of the destination airport" })),
                            municipality: t.Nullable(t.String({ description: "The municipality of the destination airport" })),
                            name: t.Nullable(t.String({ description: "The name of the destination airport" })),
                        })
                    ),
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

export async function getCallsign(callsign: string) {
    let result = await db.select().from(callsigns).where(ilike(callsigns.callsign, `%${callsign}%`)).execute();

    if (result.length === 0) {
        const res = await fetch(`https://api.adsbdb.com/v0/callsign/${callsign}`)

        if (!res.ok) {
            return null;
        }

        const data = await res.json();
        if (!data?.response?.flightroute) {
            return null;
        }

        result[0] = data.response.flightroute;
        await db.insert(callsigns).values([{
            callsign: result[0].callsign,
            callsign_icao: result[0].callsign_icao,
            callsign_iata: result[0].callsign_iata,

            airline_name: result[0].airline.name,
            airline_iata: result[0].airline.iata,
            airline_icao: result[0].airline.icao,
            airline_country: result[0].airline.country,
            airline_country_iso: result[0].airline.country_iso,
            airline_callsign: result[0].airline.callsign,

            origin_country_iso_name: result[0].origin.country_iso_name,
            origin_country_name: result[0].origin.country_name,
            origin_elevation: result[0].origin.elevation,
            origin_icao_code: result[0].origin.icao_code,
            origin_iata_code: result[0].origin.iata_code,
            origin_longitude: result[0].origin.longitude,
            origin_latitude: result[0].origin.latitude,
            origin_municipality: result[0].origin.municipality,
            origin_name: result[0].origin.name,

            destination_country_iso_name: result[0].destination.country_iso_name,
            destination_country_name: result[0].destination.country_name,
            destination_elevation: result[0].destination.elevation,
            destination_icao_code: result[0].destination.icao_code,
            destination_iata_code: result[0].destination.iata_code,
            destination_longitude: result[0].destination.longitude,
            destination_latitude: result[0].destination.latitude,
            destination_municipality: result[0].destination.municipality,
            destination_name: result[0].destination.name
        }]).onConflictDoNothing().execute();
    } else {
        result[0] = {
            callsign: result[0].callsign,
            callsign_icao: result[0].callsign_icao,
            callsign_iata: result[0].callsign_iata,

            airline: {
                name: result[0].airline_name,
                iata: result[0].airline_iata,
                icao: result[0].airline_icao,
                country: result[0].airline_country,
                country_iso: result[0].airline_country_iso,
                callsign: result[0].airline_callsign
            },

            origin: {
                country_iso_name: result[0].origin_country_iso_name,
                country_name: result[0].origin_country_name,
                elevation: result[0].origin_elevation,
                icao_code: result[0].origin_icao_code,
                iata_code: result[0].origin_iata_code,
                longitude: result[0].origin_longitude,
                latitude: result[0].origin_latitude,
                municipality: result[0].origin_municipality,
                name: result[0].origin_name
            },

            destination: {
                country_iso_name: result[0].destination_country_iso_name,
                country_name: result[0].destination_country_name,
                elevation: result[0].destination_elevation,
                icao_code: result[0].destination_icao_code,
                iata_code: result[0].destination_iata_code,
                longitude: result[0].destination_longitude,
                latitude: result[0].destination_latitude,
                municipality: result[0].destination_municipality,
                name: result[0].destination_name
            }
        }
    }

    return result[0];
}