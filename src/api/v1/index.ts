import Elysia from "elysia";
import airlines from "./airlines";
import airports from "./airports";
import aircraft from "./aircraft";
import callsign from "./callsign";

export default new Elysia({ prefix: "/v1" })
    .get("", () => "OK", { detail: { tags: ["General"] } })
    .use(airlines)
    .use(airports)
    .use(aircraft)
    .use(callsign)