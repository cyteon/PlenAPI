import Elysia, { t } from "elysia";
import db from "../../../db";
import { verifyRequest } from "../auth";
import { getAircraftByReg } from "../../v1/aircraft";
import { airlines } from "../../../db/schema";
import { ilike, or } from "drizzle-orm";
import { getCallsign } from "../../v1/callsign";

export default new Elysia({ prefix: "/search" })
    .get(
        "",
        async ({ headers, status, query }) => {
            const user = await verifyRequest(headers);

            if (!user) {
                return status(401, { error: "Unauthorized" });
            }

            const { q } = query;

            const aircraft = await getAircraftByReg(q);
            const callsign = await getCallsign(q);
            
            const airlinesRes = await db.select().from(airlines).where(
                or(
                    ilike(airlines.name, `%${q}%`),
                    or(
                        ilike(airlines.iata, `%${q}%`),
                        ilike(airlines.icao, `%${q}%`),
                    )
                )
            ).execute();

            return {
                aircraft: aircraft,
                callsign: callsign,
                airlines: airlinesRes,
            }
        },
        {
            detail: {
                hide: true,
            },
            query: t.Object({
                q: t.String({ description: "Search query for flights" }),
            }),
        }
    )