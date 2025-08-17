import Elysia from "elysia";
import flights from "./flights";

export default new Elysia({ prefix: "/app" })
    .use(flights)
