import fs from "node:fs"
import path from "node:path";
import * as csv from 'fast-csv';

interface AirlineType {
    id: string;
    name: string;
    alias?: string;
    iata?: string;
    icao?: string;
    callsign: string;
    country: string;
    active: string;
}

export async function getAirlines(): Promise<AirlineType[]> {
    let data: AirlineType[] = [];

    await new Promise<void>((resolve, reject) => {
        fs.createReadStream("static_data/airlines.csv")
            .pipe(csv.parse({ headers: false, skipLines: 1 }))
            .on("error", error => {
                reject(error);
            })
            .on("data", (row) => {
                data.push({
                    id: row[0],
                    name: row[1],
                    alias: row[2] == "\\N" ? undefined : row[2],
                    iata: row[3] || undefined,
                    icao: row[4] || undefined,
                    callsign: row[5],
                    country: row[6],
                    active: row[7]
                });
            })
            .on("end", () => {
                resolve();
            });
    });

    return data;
}