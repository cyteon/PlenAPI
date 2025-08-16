import Elysia from "elysia";
import airlines from "./airlines";

export default new Elysia({ prefix: "/v1" })
    .get("", () => "OK", { detail: { tags: ["General"] } })
    .use(airlines)