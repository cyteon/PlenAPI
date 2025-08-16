import Elysia from "elysia";
import airlines from "./airlines";
import airports from "./airports";

export default new Elysia({ prefix: "/v1" })
    .get("", () => "OK", { detail: { tags: ["General"] } })
    .use(airlines)
    .use(airports)