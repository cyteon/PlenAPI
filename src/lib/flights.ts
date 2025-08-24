import db from "../db"
import { flights } from "../db/schema";

let openSkyToken: string | null = null;

export async function start() {
    try {
        await generateToken();
        await updateFlights();
    } catch (error) {
        console.error("Error during initial setup:", error);
        return;
    }

    setInterval(
        async () => {
            try {
                await updateFlights();
                console.log("Flights data updated successfully");
            } catch (error) {
                console.error("Error updating flights data:", error);
            }
        },
        1000 * 90 // every 90 secs, suboptimal but its all we can get with the defaul limit for authenticated users
    )

    setInterval(
        async () => {
            try {
                await generateToken();
                console.log("OpenSky token refreshed successfully");
            } catch (error) {
                console.error("Error refreshing OpenSky token:", error);
            }
        },
        1000 * 60 * 28 // every 28 mins, it lasts 30mins but to have some margin
    )
}

async function updateFlights() {
    await db.delete(flights).execute();

    const res = await fetch("https://opensky-network.org/api/states/all", {
        headers: {
            "Authorization": `Bearer ${openSkyToken}`
        },
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch flights data: ${res.statusText}`);
    }

    const data = await res.json();

    if (!data?.states) {
        console.error("No flights data found in response");
        return;
    }

    const flightsData = data.states.map((flight: any) => ({
        icao24: flight[0],
        callsign: flight[1] ? flight[1].trim() : null,
        origin_country: flight[2],
        time_position: new Date(flight[3] * 1000),
        last_contact: new Date(flight[4] * 1000),
        longitude: flight[5] || null,
        latitude: flight[6] || null,
        baro_altitude: flight[7] || null,
        on_ground: flight[8] || false,
        velocity: flight[9] || null,
        true_track: flight[10] || null,
        vertical_rate: flight[11] || null,
        sensors: flight[12] || null,
        geo_altitude: flight[13] || null,
        squawk: flight[14] || null,
        spi: flight[15] || false,
        position_source: flight[16] || 0,
        category: flight[17] || null
    }));

    
    // do batches of 1k flights
    for (let i = 0; i < flightsData.length; i += 1000) {
        await db.insert(flights).values(flightsData.slice(i, i + 1000)).onConflictDoNothing().execute();
        console.log(`Inserted flight batch ${Math.ceil(i / 1000) + 1}/${Math.ceil(flightsData.length / 1000)}`);
    }
}

async function generateToken() {
    const res = await fetch("https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token", {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        body: new URLSearchParams({
            "client_id": process.env.OPENSKY_NETWORK_CLIENT_ID || "",
            "client_secret": process.env.OPENSKY_NETWORK_CLIENT_SECRET || "",
            "grant_type": "client_credentials"
        })
    });

    if (!res.ok) {
        throw new Error(`Failed to generate OpenSky token: ${res.statusText}`);
    }

    const data = await res.json();
    if (!data?.access_token) {
        throw new Error("No access token found in OpenSky response");
    }

    openSkyToken = data.access_token;
    console.log("OpenSky token generated successfully");
}