import Elysia, { t } from "elysia";
import { getAirports } from "./data";

export default new Elysia({ prefix: "/airports" })
    .get(
        "/all",
        async () => {
            return await getAirports();
        },
        {
            detail: { tags: ["Airports"] },
            response: {
                200: t.Array(
                    t.Object({
                        id: t.String(),
                        identifier: t.String(),
                        type: t.String(),
                        name: t.String(),
                        latitude: t.String(),
                        longitude: t.String(),
                        elevation: t.String(),
                        continent: t.String(),
                        country: t.String(),
                        region: t.String(),
                        municipality: t.String(),
                        scheduled_service: t.String(),
                        icao_code: t.Optional(t.String()),
                        iata_code: t.Optional(t.String()),
                        gps_code: t.Optional(t.String()),
                        local_code: t.Optional(t.String()),
                        home_link: t.Optional(t.String()),
                        wikipedia_link: t.Optional(t.String()),
                    })
                )
            }
        }
    )
    .get(
        "/search",
        async ({ query, status }) => {
            const { query: searchQuery, id } = query;

            if (!searchQuery && !id) {
                return status(400, { error: "You must provide either a 'query' or 'id' parameter" });
            }

            const airports = await getAirports();

            if (id) {
                const airport = airports.find(airport => airport.id === id);

                if (airport) {
                    return [airport];
                } else {
                    return status(400, { error: "Airport not found" });
                }
            }

            return airports.filter(airport =>
                airport.name.toLowerCase().includes(searchQuery!.toLowerCase()) ||
                (airport.iata_code && airport.iata_code.toLowerCase().includes(searchQuery!.toLowerCase())) ||
                (airport.icao_code && airport.icao_code.toLowerCase().includes(searchQuery!.toLowerCase())) ||
                (airport.identifier && airport.identifier.toLowerCase().includes(searchQuery!.toLowerCase()))
            );
        },
        {
            detail: {
                description: "Search for airports by name, IATA code, or ICAO code\nIf you specify the `id` query parameter, it will search for the airport with that ID and ignore the `query` parameter",
                tags: ["Airports"]
            },
            query: t.Object({
                query: t.Optional(t.String({ description: "The name/iata/icao of the airport to search for" })),
                id: t.Optional(t.String({ description: "The ID of the airport to search for" })),
            }),
            response: {
                200: t.Array(
                    t.Object({
                        id: t.String({ description: "The ID of the airport" }),
                        identifier: t.String({ description: "The identifier of the airport" }),
                        type: t.String({ description: "The type of the airport" }),
                        name: t.String({ description: "The name of the airport" }),
                        latitude: t.String({ description: "The latitude of the airport" }),
                        longitude: t.String({ description: "The longitude of the airport" }),
                        elevation: t.String({ description: "The elevation of the airport" }),
                        continent: t.String({ description: "The continent of the airport" }),
                        country: t.String({ description: "The country of the airport" }),
                        region: t.String({ description: "The region of the airport" }),
                        municipality: t.String({ description: "The municipality of the airport" }),
                        scheduled_service: t.String({ description: "Whether the airport has scheduled service (Y/N)" }),
                        icao_code: t.Optional(t.String({ description: "The ICAO code of the airport" })),
                        iata_code: t.Optional(t.String({ description: "The IATA code of the airport" })),
                        gps_code: t.Optional(t.String({ description: "The GPS code of the airport" })),
                        local_code: t.Optional(t.String({ description: "The local code of the airport" })),
                        home_link: t.Optional(t.String({ description: "The home link of the airport" })),
                        wikipedia_link: t.Optional(t.String({ description: "The Wikipedia link of the airport" })),
                    })
                ),
                400: t.Object({
                    error: t.String({ description: "Error message when the search fails" })
                })
            }
        }
    );