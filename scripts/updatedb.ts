// Get data from csv files and push them to db
import { configDotenv } from "dotenv";
configDotenv();

import fs from "node:fs";
import * as csv from "fast-csv";

import db from "../src/db";
import { airlines, airports } from "../src/db/schema";
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
})()