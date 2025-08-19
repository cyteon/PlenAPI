import Elysia from "elysia";
import flights from "./flights";
import auth from "./auth";
import search from "./search";

export default new Elysia({ prefix: "/app" })
    .use(flights)
    .use(auth)
    .use(search)
