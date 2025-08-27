// Get data from csv files and push them to db
import { configDotenv } from "dotenv";
configDotenv();

import fs from "node:fs";
import * as csv from "fast-csv";

import db from "../src/db";
import { aircraft, airlines, airports } from "../src/db/schema";
import { AirlineType, AirportType } from "../src/lib/types";

console.log("Updating database...");

(async () => {
    let airlinesData: AirlineType[] = [];
    fs.createReadStream("static_data/airlines.csv")
        .pipe(csv.parse({ headers: false, skipLines: 1 }))
        .on("error", error => {
            console.error("Error reading airlines data:", error);
        })
        .on("data", (row) => {
            airlinesData.push({
                id: row[0],
                name: row[1],
                alias: (row[2] == "\\N" || !row[2]) ? undefined : row[2],
                iata: row[3] || undefined,
                icao: row[4] || undefined,
                callsign: row[5],
                country: row[6],
                active: row[7]
            });
        })
        .on("end", async () => {
            console.log("Airlines data loaded, inserting into database...");

            await db.delete(airlines)
            await db.insert(airlines).values(airlinesData)

            console.log("Airlines data inserted successfully.");
        });

    let airportsData: AirportType[] = [];
    fs.createReadStream("static_data/airports.csv")
        .pipe(csv.parse({ headers: false, skipLines: 1 }))
        .on("error", error => {
            console.error("Error reading airports data:", error);
        })
        .on("data", (row) => {
            airportsData.push({
                id: row[0],
                identifier: row[1],
                type: row[2],
                name: row[3],
                latitude: row[4],
                longitude: row[5],
                elevation: row[6],
                continent: row[7],
                country: row[8],
                region: row[9],
                municipality: row[10],
                scheduled_service: row[11],
                icao_code: row[12] || undefined,
                iata_code: row[13] || undefined,
                gps_code: row[14] || undefined,
                local_code: row[15] || undefined,
                home_link: row[16] === "\\N" ? undefined : row[16],
                wikipedia_link: row[17] === "\\N" ? undefined : row[17]
            });
        })
        .on("end", async () => {
            console.log("Airports data loaded, inserting into database...");

            await db.delete(airports)

            // we have to batch cause hella many airports
            for (let i = 0; i < airportsData.length; i += 1000) {
                const batch = airportsData.slice(i, i + 1000);
                await db.insert(airports).values(batch);
                console.log(`Inserted airport batch ${Math.ceil(i / 1000) + 1}/${Math.ceil(airportsData.length / 1000)}`);
            }

            console.log("Airports data inserted successfully.");
        });
    
    let aircraftData: any[] = [];
    fs.createReadStream("static_data/aircraft.csv")
        .pipe(csv.parse({ headers: false, skipLines: 1, strictColumnHandling: false, ignoreEmpty: true, quote: "'", escape: "'" }))
        .on("error", error => {
            console.error("Error reading aircraft data:", error);
        })
        .on("data", (row) => {
            aircraftData.push(row);
        })
        .on("end", async () => {
            console.log("Aircraft data loaded, inserting into database...");

            await db.delete(aircraft);

            for (let i = 0; i < aircraftData.length; i += 1000) {
                const batch = aircraftData.slice(i, i + 1000).map(row => ({
                    icao24: row[0],
                    timestamp: row[1] ? new Date(row[1]) : null,
                    acars: row[2] === "1",
                    adsb: row[3] === "1",
                    built: row[4] ? new Date(row[4]) : null,
                    categoryDescription: row[5] || null,
                    country: row[6] || null,
                    engines: row[7] || null,
                    firstFlightDate: row[8] ? new Date(row[8]) : null,
                    firstSeen: row[9] ? new Date(row[9]) : null,
                    icaoAircraftClass: row[10] || null,
                    manufacturerIcao: row[12] || null,
                    manufacturerName: row[13] || null,
                    model: row[14] || null,
                    registered: row[25] ? new Date(row[25]) : null,
                    registration: row[26] || null,
                    serialNumber: row[28] || null,
                }));

                await db.insert(aircraft).values(batch).onConflictDoNothing().execute();

                console.log(`Inserting aircraft batch ${Math.ceil(i / 1000) + 1}/${Math.ceil(aircraftData.length / 1000)}`);
            }
        });
})()