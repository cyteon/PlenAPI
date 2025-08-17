import Elysia, { t } from "elysia";
import db from "../../../db";
import { airlines } from "../../../db/schema";
import { AirlineType } from "../../../types";
import { eq, ilike, or } from "drizzle-orm";

export default new Elysia({ prefix: "/airlines" })
    .get(
        "/all", 
        async () => {
            return (await db.select().from(airlines).execute()) as AirlineType[];
        }, 
        { 
            detail: { tags: ["Airlines"], description: "Get all airlines" },
            response: {
                200: t.Array(t.Object({
                    id: t.Number({ description: "The ID of the airline" }),
                    name: t.String({ description: "The name of the airline" }),
                    alias: t.Nullable(t.String({ description: "The alias of the airline" })),
                    iata: t.Nullable(t.String({ description: "The IATA code of the airline" })),
                    icao: t.Nullable(t.String({ description: "The ICAO code of the airline" })),
                    callsign: t.String({ description: "The callsign of the airline" }),
                    country: t.String({ description: "The country of the airline" }),
                    active: t.String({ description: "Whether the airline is active or not (Y/N)" }),
                }))
            }
        }
    )
    .get(
        "/search",
        async ({ query, status }) => {
            const { query: searchQuery, id } = query;

            if (!searchQuery && !query.id) {
                return status(400, { error: "You must provide either a 'query' or 'id' parameter" });
            }

            
            if (id) {
                const airline = await db.select().from(airlines).where(eq(airlines.id, id)).execute();
                if (airline.length === 0) {
                    return status(400, { error: "Airline not found" });
                }

                return airline as AirlineType[];
            }

            const results = await db.select().from(airlines).where(
                or(
                    ilike(airlines.name, `%${searchQuery}%`),
                    or(
                        ilike(airlines.iata, `%${searchQuery}%`),
                        ilike(airlines.icao, `%${searchQuery}%`),
                    )
                )
            ).execute()
            
            return results as AirlineType[];
        },
        {
            detail: { 
                description: "Search for airlines by name, IATA code, or ICAO code\nIf you specify the `id` query parameter, it will search for the airline with that ID and ignore the `query` parameter",
                tags: ["Airlines"] 
            },
            query: t.Object({
                query: t.Optional(t.String({ description: "The name/iata/icao of the airline to search for" })),
                id: t.Optional(t.String({ description: "The ID of the airline to search for" })),
            }),
            response: {
                200: t.Array(t.Object({
                    id: t.Number({ description: "The ID of the airline" }),
                    name: t.String({ description: "The name of the airline" }),
                    alias: t.Nullable(t.String({ description: "The alias of the airline" })),
                    iata: t.Nullable(t.String({ description: "The IATA code of the airline" })),
                    icao: t.Nullable(t.String({ description: "The ICAO code of the airline" })),
                    callsign: t.String({ description: "The callsign of the airline" }),
                    country: t.String({ description: "The country of the airline" }),
                    active: t.String({ description: "Whether the airline is active or not (Y/N)" }),
                })),
                400: t.Object({
                    error: t.String({ description: "Error message" })
                })
            }
        }
    )