import Elysia, { t } from "elysia";
import db from "../../../db";
import { aircraft, flights } from "../../../db/schema";
import { eq, ilike } from "drizzle-orm";
import { verifyRequest } from "../auth";
import { getCallsign } from "../../v1/callsign";


const categories = `Aircraft category. 
- 0 = No information at all
- 1 = No ADS-B Emitter Category Information
- 2 = Light (< 15500 lbs)
- 3 = Small (15500 to 75000 lbs)
- 4 = Large (75000 to 300000 lbs)
- 5 = High Vortex Large (aircraft such as B-757)
- 6 = Heavy (> 300000 lbs)
- 7 = High Performance (> 5g acceleration and 400 kts)
- 8 = Rotorcraft
- 9 = Glider / sailplane
- 10 = Lighter-than-air
- 11 = Parachutist / Skydiver
- 12 = Ultralight / hang-glider / paraglider
- 13 = Reserved
- 14 = Unmanned Aerial Vehicle
- 15 = Space / Trans-atmospheric vehicle
- 16 = Surface Vehicle - Emergency Vehicle
- 17 = Surface Vehicle - Service Vehicle
- 18 = Point Obstacle (includes tethered balloons)
- 19 = Cluster Obstacle
- 20 = Line Obstacle`

export default new Elysia({ prefix: "/flights" })
    .get(
        "/all",
        async ({ headers }) => {
            const user = await verifyRequest(headers);

            if (!user) {
                return { error: "Unauthorized" };
            }

            const data = await db.select({
                icao24: flights.icao24,
                longitude: flights.longitude,
                latitude: flights.latitude,
                trueTrack: flights.true_track,
                icaoAircraftClass: aircraft.icaoAircraftClass,
                squawk: flights.squawk
            }).from(flights).leftJoin(aircraft, eq(flights.icao24, aircraft.icao24)).execute();

            return data.map(flight => ({
                icao24: flight.icao24,
                longitude: flight.longitude,
                latitude: flight.latitude,
                trueTrack: flight.trueTrack,
                iac: flight.icaoAircraftClass || null,
                em: flight.squawk === "7700" || flight.squawk === "7600" || flight.squawk === "7500" ? true : undefined
            }));
        },
        { 
            detail: { tags: ["Flights"], description: "Get all planes currently in the air, has minimal data" }, // TODO: hide from swagger
            response: {
                200: t.Array(
                    t.Object({
                        icao24: t.String({ description: "Unique ICAO 24-bit address of the transponder in hex string representation." }),
                        longitude: t.Nullable(t.Number({ description: "WGS-84 longitude in decimal degrees." })),
                        latitude: t.Nullable(t.Number({ description: "WGS-84 latitude in decimal degrees." })),
                        trueTrack: t.Nullable(t.Number({ description: "True track in decimal degrees clockwise from north (north=0°)." })),
                        iac: t.Nullable(t.String({ description: "ICAO Aircraft Class" })),
                        em: t.Optional(t.Boolean({ description: "If aircraft is an emergency or not" }))
                    })
                )
            }
        }
    )
    .get("/icao24/:icao24",
        async ({ params, status, headers }) => {
            const user = await verifyRequest(headers);

            if (!user) {
                return status(401, { error: "Unauthorized" });
            }

            const { icao24 } = params;

            console.log("Fetching flights with icao24:", icao24);
            if (!icao24) {
                return status(400, { error: "You must provide a 'icao24' parameter" });
            }

            const data = await db.select().from(flights).where(ilike(flights.icao24, `%${icao24}%`)).execute();

            if (data.length === 0) {
                return status(404, { error: "No flights found with the given icao24" });
            }

            let callsignData;

            try {
                callsignData = await getCallsign(data[0].callsign);
            } catch (error) {
                console.error("Error fetching callsign data:", error);
                callsignData = null;
            }

            let icaoData = await db.select().from(aircraft).where(ilike(aircraft.icao24, `%${data[0].icao24}%`)).limit(1).execute();
            
            let images = [];

            try {
                const res = await fetch(`https://airport-data.com/api/ac_thumb.json?m=${data[0].icao24}&n=4`);

                if (res.ok) {
                    const data = await res.json();

                    if (data.status == 200 && data.data) {
                        images = data.data.map((img: any) => img.image.replace("thumbnails/", ""));
                    }
                }
            } catch (error) {
                console.error("Error fetching images:", error);
            }

            return data.map(flight => ({
                icao24: flight.icao24,
                callsign: flight.callsign,
                originCountry: flight.origin_country,
                timePosition: flight.time_position ? Math.floor(flight.time_position.getTime() / 1000) : null,
                lastContact: flight.last_contact ? Math.floor(flight.last_contact.getTime() / 1000) : null,
                longitude: flight.longitude,
                latitude: flight.latitude,
                baroAltitude: flight.baro_altitude,
                onGround: flight.on_ground === "true",
                velocity: flight.velocity,
                trueTrack: flight.true_track,
                verticalRate: flight.vertical_rate,
                sensors: flight.sensors ? flight.sensors.split(",").map(Number) : null,
                geoAltitude: flight.geo_altitude,
                squawk: flight.squawk,
                spi: flight.spi === "true",
                positionSource: flight.position_source,
                category: flight.category,
                callsignData,
                icaoData: icaoData[0] || null,
                images
            }))[0];
        },
        {
            detail: { tags: ["Flights"], description: "Get flights by icao24" }, // TODO: hide from swagger
            params: t.Object({
                icao24: t.String({ description: "The icao24 of the flight" })
            }),
            response: {
                200: t.Object({
                    icao24: t.String({ description: "Unique ICAO 24-bit address of the transponder in hex string representation." }),
                    callsign: t.Nullable(t.String({ description: "Callsign of the vehicle (8 chars). Can be null if no callsign has been received." })),
                    originCountry: t.String({ description: "Country name inferred from the ICAO 24-bit address." }),
                    timePosition: t.Number({ description: "Unix timestamp (seconds) for the last position update. Can be null if no position report was received by OpenSky within the past 15s." }),
                    lastContact: t.Number({ description: "Unix timestamp (seconds) for the last update in general. This field is updated for any new, valid message received from the transponder." }),
                    longitude: t.Nullable(t.Number({ description: "WGS-84 longitude in decimal degrees." })),
                    latitude: t.Nullable(t.Number({ description: "WGS-84 latitude in decimal degrees." })),
                    baroAltitude: t.Optional(t.Nullable(t.Number({ description: "Barometric altitude in meters." }))),
                    onGround: t.Boolean({ description: "Boolean value which indicates if the position was retrieved from a surface position report." }),
                    velocity: t.Nullable(t.Number({ description: "Velocity over ground in m/s." })),
                    trueTrack: t.Nullable(t.Number({ description: "True track in decimal degrees clockwise from north (north=0°)." })),
                    verticalRate: t.Nullable(t.Number({ description: "Vertical rate in m/s. A positive value indicates that the airplane is climbing, a negative value indicates that it descends." })),
                    sensors: t.Nullable(t.Array(t.Number({ description: "IDs of the receivers which contributed to this state vector. Is null if no filtering for sensor was used in the request." }))),
                    geoAltitude: t.Nullable(t.Number({ description: "Geometric altitude in meters." })),
                    squawk: t.Nullable(t.String({ description: "The transponder code aka Squawk." })),
                    spi: t.Boolean({ description: "Whether flight status indicates special purpose indicator." }),
                    positionSource: t.Number({ description: "Origin of this state's position.\n- 0 = ADS-B\n- 1 = ASTERIX\n- 2 = FLARM\n- 3 = MLAT\n- 4 = FLARM+MLAT" }),
                    category: t.Nullable(t.Number({ description: categories })),
                    callsignData: t.Any(), // im too lazy to 
                    icaoData: t.Any(),     // fill these two out
                    images: t.Array(t.String())
                }),
                400: t.Object({
                    error: t.String({ description: "Error message" })
                }),
                404: t.Object({
                    error: t.String({ description: "No flights found with the given callsign" })
                })
            }
        }
    )