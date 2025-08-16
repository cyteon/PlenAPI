import fs from "node:fs"
import * as csv from 'fast-csv';

interface AirportType {
    id: string;
    identifier: string;
    type: string;
    name: string;
    latitude: string;
    longitude: string;
    elevation: string;
    continent: string;
    country: string;
    region: string;
    municipality: string;
    scheduled_service: string;
    icao_code?: string;
    iata_code?: string;
    gps_code?: string;
    local_code?: string;
    home_link?: string;
    wikipedia_link?: string;
}

export async function getAirports(): Promise<AirportType[]> {
    let data: AirportType[] = [];

    await new Promise<void>((resolve, reject) => {
        fs.createReadStream("static_data/airports.csv")
            .pipe(csv.parse({ headers: false, skipLines: 1 }))
            .on("error", error => {
                reject(error);
            })
            .on("data", (row) => {
                data.push({
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
            .on("end", () => {
                resolve();
            });
    });

    return data;
}