import Elysia, { t } from "elysia";
import { getAirlines } from "./data";

export default new Elysia({ prefix: "/airlines" })
    .get(
        "/all", 
        async () => {
            return await getAirlines();
        }, 
        { 
            detail: { tags: ["Airlines"] },
            response: {
                200: t.Array(t.Object({
                    id: t.String({ description: "The ID of the airline" }),
                    name: t.String({ description: "The name of the airline" }),
                    alias: t.Optional(t.String({ description: "The alias of the airline" })),
                    iata: t.Optional(t.String({ description: "The IATA code of the airline" })),
                    icao: t.Optional(t.String({ description: "The ICAO code of the airline" })),
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

            const airlines = await getAirlines();
            
            if (id) {
                const airline = airlines.find(airline => airline.id === id);

                if (airline) {
                    return [airline];
                } else {
                    return status(400, { error: "Airline not found" });
                }
            }

            return airlines.filter(airline =>
                airline.name.toLowerCase().includes(searchQuery!.toLowerCase()) ||
                (airline.iata && airline.iata.toLowerCase().includes(searchQuery!.toLowerCase())) ||
                (airline.icao && airline.icao.toLowerCase().includes(searchQuery!.toLowerCase()))
            );
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
                    id: t.String({ description: "The ID of the airline" }),
                    name: t.String({ description: "The name of the airline" }),
                    alias: t.Optional(t.String({ description: "The alias of the airline" })),
                    iata: t.Optional(t.String({ description: "The IATA code of the airline" })),
                    icao: t.Optional(t.String({ description: "The ICAO code of the airline" })),
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