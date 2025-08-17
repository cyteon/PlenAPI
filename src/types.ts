export interface AirportType {
    id: number;
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

export interface AirlineType {
    id: number;
    name: string;
    alias?: string;
    iata?: string;
    icao?: string;
    callsign: string;
    country: string;
    active: string;
}
